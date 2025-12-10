import React from 'react';
import Link from 'next/link';
import { MongoClient } from 'mongodb';

const PolicyPanel = ({ policies }) => {
  return (
    <section className="w-[60vw] mx-auto bg-white rounded-2xl body-font overflow-hidden">
      <h1 className="w-max mx-auto text-4xl underline">Available Schemes & Benefits</h1>
      <div className="container px-5 py-24 mx-auto">
        <div className="-my-8 divide-y-2 divide-gray-100">
          {policies.length > 0 ? (
            policies.map((policy) => (
              <div key={policy._id} className="bg-white shadow-2xl rounded-2xl my-2 px-3 py-8 flex flex-wrap md:flex-nowrap">
                <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                  <span className="font-semibold title-font text-gray-700">{policy.department}</span>
                  <span className="mt-1 text-gray-500 text-sm">{policy.lastUpdated}</span>
                </div>
                <div className="md:flex-grow">
                  <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">{policy.title}</h2>
                  <p className="">{policy.description}</p>
                  <Link href={`/policy/${policy.slug}`} className="text-indigo-500 inline-flex items-center mt-4">
                    Manage Policy
                    <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"></path>
                      <path d="M12 5l7 7-7 7"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No policies found. Create your first policy using the "Add New Policy" button.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export async function getServerSideProps() {
  try {
    const client = await MongoClient.connect(process.env.MONGO_URI3, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = client.db("PolicyDB");
    const collection = db.collection("policies");
    const policies = await collection.find().sort({ lastUpdated: -1 }).toArray();

    client.close();

    return {
      props: {
        policies: policies.map(policy => ({
          _id: policy._id.toString(),
          title: policy.title,
          slug: policy.slug,
          department: policy.department,
          status: policy.status,
          lastUpdated: policy.lastUpdated,
          description: policy.description,
        }))
      }
    };
  } catch (error) {
    console.error("Error fetching policies:", error);
    return { props: { policies: [] } };
  }
}

export default PolicyPanel; 