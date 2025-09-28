import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/cart(.*)',
  '/my-orders(.*)',
  '/add-address(.*)',
  '/api/order(.*)',
  '/api/address(.*)',
  '/seller(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: [ '/((?!.*\..*|_next).*)', '/', '/(api|trpc)(.*)']
};
