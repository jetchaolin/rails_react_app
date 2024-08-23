var blob = new Blob(["image"], { type: "image/png" });
blob["lastModifiedDate"] = "2024-01-01 00:00:00";
blob["name"] = "filename";
var fakeF = blob;
