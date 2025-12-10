import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MongoClient } from "mongodb";
import AddIssue from '@/components/AddIssue'

const Issues = ({ issues }) => {
  return (
    <section className="w-[60vw] mx-auto bg-white rounded-xl shadow-lg p-6">
      <AddIssue></AddIssue>
      <h1 className="text-4xl font-bold text-center mb-6">Reported Issues</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {issues.map((issue) => (
          <div key={issue._id} className="bg-gray-100 p-4 rounded-lg shadow-md">
            {/* Issue Image */}
            <img
              src={issue.image}
              alt={issue.title}
              className="w-full h-48 object-cover rounded-md"
            />
            
            {/* Issue Details */}
            <h2 className="text-2xl font-semibold mt-4">{issue.title}</h2>
            <p className="text-gray-600 mt-2">{issue.description}</p>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-700 mt-3">
              <FaMapMarkerAlt className="text-red-500" />
              <span>{issue.location}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Issues;

// Fetch issues from MongoDB
export async function getServerSideProps() {
  try {
    const client = await MongoClient.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = client.db("IssueList"); // Replace with your DB name
    const collection = db.collection("issues");

    // Fetch all issues from the database
    const issues = await collection.find().toArray();

    client.close();

    return {
      props: {
        issues: issues.map((issue) => ({
          _id: issue._id.toString(),
          title: issue.title,
          image: issue.image,
          description: issue.description,
          location: issue.location,
        })),
      },
    };
  } catch (error) {
    console.error("Error fetching issues:", error);
    return { props: { issues: [] } };
  }
}
