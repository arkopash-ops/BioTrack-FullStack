import { UserDocument } from "../../models/user.model";

declare global {      // modifying global types
  namespace Express {      // built-in namespace for Express types
    interface Request {      // merging with the existing Express Request interface
      user?: UserDocument;      // optional property that represents the logged-in user.
    }
  }
}
