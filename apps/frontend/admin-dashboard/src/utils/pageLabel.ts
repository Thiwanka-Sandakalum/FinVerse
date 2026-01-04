import { RouteMeta, ROUTES } from "./routeConfig";

// Helper to turn a route path with params into a regex
function pathToRegex(routePath: string): RegExp {
    // Replace :param with a non-slash matcher
    const regexStr = routePath.replace(/:[^/]+/g, '[^/]+');
    return new RegExp('^' + regexStr + '$');
}

function findLabel(path: string, routes: RouteMeta[]): string | undefined {
    for (const route of routes) {
        // Exact match
        if (route.path === path) return route.label;
        // Param match
        if (route.path.includes(':')) {
            const regex = pathToRegex(route.path);
            if (regex.test(path)) return route.label;
        }
        // Check children
        if (route.children) {
            const childLabel = findLabel(path, route.children);
            if (childLabel) return childLabel;
        }
    }
    return undefined;
}

export function getPageLabel(path: string): string {
    return findLabel(path, ROUTES) || 'Overview';
}