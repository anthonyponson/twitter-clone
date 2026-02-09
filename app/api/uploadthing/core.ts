// src/app/api/uploadthing/core.ts

import { createUploadthing, type FileRouter } from "uploadthing/next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

const f = createUploadthing()

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique route slug
  profilePictureUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      const session = await getServerSession(authOptions)
      if (!session) throw new Error("Unauthorized")

      // THIS is where the problem is. session.user.id is undefined!
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId)
      console.log("file url", file.url)

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId, url: file.url }
    }),



    postImageUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    // All post images must be uploaded by a logged-in user
    .middleware(async ({ req }) => {
      const session = await getServerSession(authOptions);
      if (!session) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Post Image Upload complete for userId:", metadata.userId);
      return { uploadedBy: metadata.userId, url: file.url };
    }),

} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
