import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client";

// Base HTTP connection
const httpLink = new HttpLink({
    uri: "https://localhost:4000/graphql",
});

// Authentication link (modern ApolloLink version)
const authLink = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem("token");

    operation.setContext(({ headers = {} }) => ({
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : "",
        },
    }));

    return forward(operation);
});

export const client = new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache(),
});
