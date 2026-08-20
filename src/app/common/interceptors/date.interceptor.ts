import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
export const dateInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  if (!req.body || typeof req.body !== 'object' || req.body instanceof FormData || req.body instanceof Blob) {
    return next(req);
  }

  // Deep clone and transform
  const formatBody = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') return obj;

    // Handle Arrays
    if (Array.isArray(obj)) {
      return obj.map(item => formatBody(item));
    }

    // Handle Date objects
    if (obj instanceof Date) {
      if (isNaN(obj.getTime())) return null; // Guard against Invalid Dates
      const adjustedDate = new Date(obj);
      adjustedDate.setHours(12, 0, 0, 0);
      return adjustedDate.toISOString();
    }

    // Handle Objects
    const newObj: any = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = formatBody(obj[key]);
    }
    return newObj;
  };

  const clonedReq = req.clone({
    body: formatBody(req.body)
  });

  return next(clonedReq);
};

/* export const dateInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  if (req.body) {
    // Clone the request and format the dates in the body
    const formatBody = (body: any): any => {
      if (body === null || typeof body !== 'object') {
        return body;
      }

      for (const key of Object.keys(body)) {
        const value = body[key];

        if (value instanceof Date) {
          // Fix: Prevent timezone shift by setting to midday before ISO conversion
          const adjustedDate = new Date(value);
          adjustedDate.setHours(12, 0, 0, 0); 
          body[key] = adjustedDate.toISOString();
        } else if (typeof value === 'object') {
          formatBody(value); // Recursive call for nested objects
        }
      }
      return body;
    };

    const clonedReq = req.clone({
      body: formatBody({ ...req.body as object })
    });

    return next(clonedReq);
  }

  return next(req);
}; */