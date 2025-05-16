import Cookies from 'js-cookie';
interface Author {
  id: string;
  name: string;
  email: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export default async function AuthorPage({
  params,
}: {
  params: { slug: string };
}) {

  try {
    const response = await fetch(`http://localhost:3000/api/author/${params.slug}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch author data');
    }

    const author = await response.json();

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Author Profile</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">{author.name}</h2>
          <p className="text-gray-600 mb-4">{author.email}</p>
          {author.bio && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Bio</h3>
              <p>{author.bio}</p>
            </div>
          )}
          <div className="text-sm text-gray-500">
            Joined: {new Date(author.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Error</h1>
        <p className="text-red-600">Failed to load author information</p>
      </div>
    );
  }
}