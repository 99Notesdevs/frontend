import { useRouter } from 'next/router';
import { navItems } from '@/components/Navbar/navData';

const FreeStudyMaterialPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  // Convert slug array to path parts
  const pathParts = Array.isArray(slug) ? slug : [];

  // Function to get content based on path
  const getContent = () => {
    if (!pathParts.length) return null;

    const studyMaterial = navItems['Free Study Material'];
    let content: any = studyMaterial;
    let breadcrumb: string[] = [];
    let title = '';

    // Navigate through the path parts to find the content
    pathParts.forEach((part, index) => {
      const normalizedPart = part.replace(/-/g, ' ');
      breadcrumb.push(normalizedPart);

      if (index === 0) {
        // First level (Download PYQS, UPSC Syllabus, etc.)
        content = Object.entries(studyMaterial).find(([key]) => 
          key.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-') === part
        )?.[1];
        title = normalizedPart;
      } else if (index === 1) {
        // Second level (Previous Papers, Syllabus, etc.)
        content = Object.entries(content).find(([key]) =>
          key.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-') === part
        )?.[1];
        title = normalizedPart;
      } else if (index === 2) {
        // Third level (specific categories)
        const [category, items] = Object.entries(content).find(([key]) =>
          key.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-') === part
        ) || [];
        content = items;
        title = normalizedPart;
      } else if (index === 3) {
        // Fourth level (specific items)
        content = Array.isArray(content) ? content.find((item: string) =>
          item.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-') === part
        ) : null;
        title = normalizedPart;
      }
    });

    return { content, breadcrumb, title };
  };

  const { content, breadcrumb, title } = getContent() || {};

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-red-600">Page Not Found</h1>
          <p className="mt-4 text-gray-600">The requested Study Material page could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <a href="/free-study-material" className="text-blue-600 hover:text-blue-800">
                Free Study Material
              </a>
              <svg className="w-3 h-3 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            {breadcrumb?.map((item, index) => (
              <li key={index} className="flex items-center">
                <span className={index === breadcrumb?.length - 1 ? "text-gray-700" : "text-blue-600 hover:text-blue-800"}>
                  {item}
                </span>
                {index < breadcrumb.length - 1 && (
                  <svg className="w-3 h-3 mx-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{title}</h1>
          
          {typeof content === 'string' || Array.isArray(content) ? (
            // Render content for specific items
            <div className="prose max-w-none">
              <p className="text-gray-600">
                Content for {title} will be available soon.
              </p>
            </div>
          ) : (
            // Render navigation for subcategories
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(content || {}).map(([key, value]) => (
                <div key={key} className="bg-gray-50 rounded-lg p-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">{key}</h2>
                  <ul className="space-y-2">
                    {Array.isArray(value) ? value.map((item) => (
                      <li key={item}>
                        <a
                          href={`${router.asPath}/${item.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {item}
                        </a>
                      </li>
                    )) : null}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreeStudyMaterialPage; 