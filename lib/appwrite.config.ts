import * as sdk from "node-appwrite"
export const {
    PROJECT_ID,
    API_KEY,
    NEXT_PUBLIC_PATIENT_PROFILE_BUCKET_ID: PATIENT_PROFILE_BUCKET_ID,
    NEXT_PUBLIC_ENDPOINT: ENDPOINT
} = process.env;

const client = new sdk.Client();

client.
setEndpoint(ENDPOINT!)
.setProject(PROJECT_ID!)
.setKey(API_KEY!);

export const storage = new sdk.Storage(client)
export const messaging = new sdk.Messaging(client)
