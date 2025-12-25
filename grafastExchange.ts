import { execute, hookArgs } from "grafast";
import {
	CombinedError,
	type Exchange,
	type Operation,
	type OperationResult,
} from "urql";
import { filter, fromPromise, mergeMap, pipe } from "wonka";
import type { App, H3Event } from "h3";
import {
  getQuery,
  getRequestHeaders,
  getRequestProtocol,
  readRawBody,
} from "h3";

import type { Maybe } from "grafast";
import type { PostGraphileInstance } from "postgraphile";
import { getEvent, getWebRequest } from "vinxi/http";
import { GrafservBodyBuffer, normalizeRequest, processHeaders, RequestDigest } from "postgraphile/grafserv";

export const grafastExchange = (pgl: PostGraphileInstance): Exchange => {
	return () => (ops$) => {
		return pipe(
			ops$,

			// Skip anything that's not a query since that's all we can run
			filter((operation) => operation.kind === "query" || operation.kind === "mutation"),

			mergeMap((operation) => fromPromise(runGrafastQuery(pgl, operation))),
		);
	};
};

/* This is a direct copy from: https://github.com/graphile/crystal/blob/main/grafast/grafserv/src/servers/h3/v1/index.ts#L24 */
function getDigest(event: H3Event): RequestDigest {
  const req = event.node.req;
  const res = event.node.res;
  return {
    httpVersionMajor: req.httpVersionMajor,
    httpVersionMinor: req.httpVersionMinor,
    isSecure: getRequestProtocol(event) === "https",
    method: event.method,
    path: event.path,
    headers: processHeaders(getRequestHeaders(event)),
    getQueryParams() {
      return getQuery(event) as Record<string, string | string[]>;
    },
    async getBody() {
      const buffer = await readRawBody(event, false);
      if (!buffer) {
        throw new Error("Failed to retrieve body from h3");
      }
      return {
        type: "buffer",
        buffer,
      } as GrafservBodyBuffer;
    },
    requestContext: {
      h3v1: {
        event,
      },
      node: {
        req,
        res,
      },
    },
  };
}

/**
 * Run the URQL query with Grafast, without making an HTTP request to ourselves (which is unnecessary overhead).
 *
 * @param pgl Postgraphile instance that we will run the URQL query with.
 * @param operation URQL operation, typically a query that will be run with Grafast.
 * @returns Query data, which is used to pass along in the Exchange chain.
 */
const runGrafastQuery = async (
	pgl: PostGraphileInstance,
	operation: Operation,
): Promise<OperationResult> => {
	try {
		const { variables: variableValues, query: document } = operation;

		const { schema, resolvedPreset } = await pgl.getSchemaResult();

		// Request/H3 info so we can run with it
		const event = await getEvent();
		const http = normalizeRequest(getDigest(event));

		// Add the Graphile context to our args so Grafast can run
		const args = await hookArgs({
			schema,
			document,
			variableValues: variableValues as Maybe<{
				readonly [variable: string]: unknown;
			}>,
			resolvedPreset,
			requestContext: {
				...http.requestContext,
				http,
			}
		});

		// Run the query with Grafast, to get the result from PostgreSQL
		const result = await execute(args);

		if (!result || typeof result !== "object" || !("data" in result)) {
			throw new Error("Unexpected result format from execute");
		}

		const { data, errors, extensions } = result;

		if (errors && errors.length > 0) {
			return {
				operation,
				data,
				error: new CombinedError({ graphQLErrors: [...errors] }),
				extensions,
				stale: false,
				hasNext: false,
			};
		}

		return {
			operation,
			data,
			error: undefined,
			extensions,
			stale: false,
			hasNext: false,
		};
	} catch (error) {
		console.error("Error in runGrafastQuery:", error);

		return {
			operation,
			data: undefined,
			error: new CombinedError({
				networkError: error instanceof Error ? error : new Error(String(error)),
			}),
			extensions: undefined,
			stale: false,
			hasNext: false,
		};
	}
};
