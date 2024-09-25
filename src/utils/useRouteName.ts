export const useRouteName = (path: string): string => {
    const baseRoute = path.split('/')[1] || 'Dashboard';
    return baseRoute.charAt(0).toUpperCase() + baseRoute.slice(1);
};

export const is404Page = (path: string): boolean => path === '/404' || path === '/test';
