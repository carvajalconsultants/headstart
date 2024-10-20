import { execute, hookArgs } from "grafast";
import {
	CombinedError,
	type Exchange,
	type Operation,
	type OperationResult,
} from "urql";
import { filter, fromPromise, mergeMap, pipe } from "wonka";

import type { Maybe } from "grafast";
import type { PostGraphileInstance } from "postgraphile";

export const grafastExchange = (pgl: PostGraphileInstance): Exchange => {
	return () => (ops$) => {
		return pipe(
			ops$,

			// Skip anything that's not a query since that's all we can run
			filter((operation) => operation.kind === "query"),

			mergeMap((operation) => fromPromise(runGrafastQuery(pgl, operation))),
		);
	};
};

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

		const args = {
			resolvedPreset: pgl.getResolvedPreset(),
			schema: await pgl.getSchema(),
			document,
			variableValues: variableValues as Maybe<{
				readonly [variable: string]: unknown;
			}>,
		};
		// Add the Graphile context to our args so Grafast can run
		await hookArgs(args);

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
