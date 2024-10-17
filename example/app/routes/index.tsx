// app/routes/index.tsx
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { useContext, useEffect } from "react";
import { Client, gql, useClient, useQuery, useSubscription } from "urql";
import { z } from "zod";

const CHARITIES_PER_PAGE = 3;

const allCharitiesSubscription = gql`
  subscription AllCharities {
  charities {
    event
    charity {
      id
      rowId
      name
    }
  } 
  }
`;

//TODO Change to valibot
const paramSchema = z.object({
	page: z.number().int().nonnegative().default(1).catch(1),
});

interface Charity {
	id: string;
	name: string;
}

export const Route = createFileRoute("/")({
	component: Home,

	validateSearch: zodSearchValidator(paramSchema),

	loaderDeps: ({ search: { page } }) => ({ page }),
	loader: ({ context, deps: { page } }) =>
		context.client.query(
			gql`
      query allCharities($first: Int!, $offset: Int!) {
        allCharities(first: $first, offset: $offset) {
          nodes {
            id
            name
          }
          totalCount
        }
      }
    `,
			{ first: CHARITIES_PER_PAGE, offset: (page - 1) * CHARITIES_PER_PAGE },
		),
	pendingComponent: () => (
		<div className="text-2xl font-bold text-center mt-8">Loading...</div>
	),
	errorComponent: ErrorComponent,
});

function Home() {
	// const [{ data, error }] = useSubscription({ query: allCharitiesSubscription, }, handleSubscription);
	const { page } = Route.useSearch();
	// const { data, error } = Route.useLoaderData()
	// const { client } = Route.useRouteContext();

	//TODO This produces the SSR useContext error, where the GraphProvider does not seem to be available in our Wrap component
	const [{ data, error }] = useQuery({
		requestPolicy: "cache-first",
		query: gql`
    query allCharities($first: Int!, $offset: Int!) {
      allCharities(first: $first, offset: $offset) {
        nodes {
          id
          name
        }
        totalCount
      }
    }
  `,
		variables: {
			first: CHARITIES_PER_PAGE,
			offset: (page - 1) * CHARITIES_PER_PAGE,
		},
	});

	//TODO unsubscribe when component is unmounted
	useSubscription({ query: allCharitiesSubscription });

	useQuery({
		requestPolicy: "cache-first",
		query: gql`
    query allCharities($first: Int!, $offset: Int!) {
      allCharities(first: $first, offset: $offset) {
        nodes {
          id
          name
        }
        totalCount
      }
    }
  `,
		variables: {
			first: CHARITIES_PER_PAGE,
			offset: (page - 1) * CHARITIES_PER_PAGE,
		},
	});

	const navigate = Route.useNavigate();
	const router = useRouter();

	// console.log("subscription result", result);
	// client.subscription(allCharitiesSubscription).subscribe((data) => {
	//   console.log("got data?", data);
	// });

	const totalPages = Math.ceil(
		(data?.allCharities?.totalCount || 0) / CHARITIES_PER_PAGE,
	);

	const handlePageChange = (newPage: number) => {
		navigate({ search: { page: newPage } });
	};

	return (
		<div className="p-2">
			<h1 className="text-2xl font-bold mb-4">Charities</h1>
			{data?.allCharities?.nodes?.length ? (
				<>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{data.allCharities.nodes.map((charity: Charity) => (
							<CharityCard key={charity.id} charity={charity} />
						))}
					</div>
					<div className="mt-8 flex justify-center">
						{/* TODO Change this to Link which should be typed */}
						<button
							type="button"
							onClick={() => handlePageChange(page - 1)}
							disabled={page === 1}
							className="px-4 py-2 mr-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
						>
							Previous
						</button>
						<span className="px-4 py-2">
							Page {page} of {totalPages}
						</span>
						{/* TODO Change this to Link which should be typed */}
						<button
							type="button"
							onClick={() => handlePageChange(page + 1)}
							disabled={page === totalPages}
							className="px-4 py-2 ml-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
						>
							Next
						</button>
					</div>
				</>
			) : (
				<p className="text-gray-500 mt-4">No charities found.</p>
			)}
			{error && <p className="text-red-500 mt-4">Oh no... {error.message}</p>}
		</div>
	);
}

// Component for rendering individual charity cards
function CharityCard({ charity }: { charity: Charity }) {
	return (
		<div className="bg-gray-800 shadow-md rounded-lg p-4">
			<h2 className="text-xl font-semibold mb-2 text-white">{charity.name}</h2>
			<p className="text-gray-400">ID: {charity.id}</p>
		</div>
	);
}

// Skeleton component for loading state
function CharityCardSkeleton() {
	return (
		<div className="bg-gray-800 shadow-md rounded-lg p-5 space-y-4 animate-pulse">
			<div className="h-6 bg-gray-700 rounded mb-2" />
			<div className="h-4 bg-gray-700 rounded w-3/4" />
		</div>
	);
}

// Error component for handling and displaying errors
function ErrorComponent({ error }: { error: Error }) {
	return (
		<div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
			<div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-6">
				<h1 className="text-3xl font-bold text-red-600 mb-4">
					Oops! Something went wrong
				</h1>
				<div className="mb-4">
					<h2 className="text-xl font-semibold text-red-800 mb-2">
						Error Details:
					</h2>
					<pre className="bg-red-100 p-3 rounded-md text-sm overflow-x-auto">
						{JSON.stringify(error, null, 2)}
					</pre>
				</div>
				<button
					type="button"
					onClick={() => window.location.reload()}
					className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
				>
					Try Again
				</button>
			</div>
		</div>
	);
}
