import React, { useEffect, useState } from 'react';
import Template from '../../../template/template';
import Breadcrumb from '../../../components/breadcrumb/breadcrumb';
import { useLocation, useNavigate } from 'react-router-dom';
import useInstructorStore from '../../../zustand/public/course/instructorStore';
import { InstructorCard } from '../../../components/card/cardInstructor';

export default function ListInstructor() {
  const location = useLocation();
  const navigate = useNavigate();
  const breadcrumbItems = [
    { label: 'Tanamin Course', path: '/beranda' },
    { label: 'Instruktur', path: location.pathname },
  ];

  const { instructors, loading, error, fetchInstructorList, fetchMoreInstructors } =
    useInstructorStore();

  const [moreCounts, setMoreCounts] = useState({});

  useEffect(() => {
    fetchInstructorList();
  }, [fetchInstructorList]);

  const handleLoadMore = (categoryId) => {
    const nextMore = (moreCounts[categoryId] || 0) + 1;
    setMoreCounts((prev) => ({ ...prev, [categoryId]: nextMore }));
    fetchMoreInstructors(categoryId, nextMore);
  };

  const handleCardClick = (id) => {
    navigate(`/instruktur/detail/${id}`);
  };

  // Helper to check if array is flat instructor list
  const isFlatInstructorList =
    Array.isArray(instructors) && instructors.length > 0 && !instructors[0].category;

  return (
    <Template activeNav="course.Instruktur" locationKey={location.key}>
      <main className="min-h-screen bg-white xl:px-24 lg:px-16 md:px-10 sm:px-6 px-2 pt-6 w-full mb-8">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex-1 w-full mt-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-primary-700 mb-2">
            Tanamin Professional Educators
          </h1>
          <h5 className="text-base sm:text-lg md:text-xl font-light text-primary-800">
            Kenali para instruktur ahli yang siap membimbing Anda di setiap kursus Tanamin
          </h5>
        </div>

        <div className="mt-6">
          {loading && <div className="text-center py-8 text-primary-700">Loading...</div>}
          {error && <div className="text-center py-8 text-red-500">{error}</div>}
          {!loading && !error && (
            <div>
              {isFlatInstructorList ? (
                <div className="mb-10">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-primary-700 mb-3 capitalize">
                    Semua Instruktur
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {instructors.map((ins) => (
                      <InstructorCard
                        key={ins.id}
                        id={ins.id}
                        image={ins.photo_profile}
                        name={ins.name}
                        expertise={ins.expertise}
                        courseCount={ins.course_held}
                        onClick={handleCardClick}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                instructors.map((categoryObj, idx) => {
                  // Defensive: skip if category is missing
                  if (!categoryObj || !categoryObj.category) return null;
                  return (
                    <div key={categoryObj.category.id || idx} className="mb-10">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-primary-700 mb-3 capitalize">
                        {categoryObj.category.title}
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {(categoryObj.user || []).map((ins) => (
                          <InstructorCard
                            key={ins.id}
                            id={ins.id}
                            image={ins.photo_profile}
                            name={ins.name}
                            expertise={ins.expertise}
                            courseCount={ins.course_held}
                            onClick={handleCardClick}
                          />
                        ))}
                      </div>
                      {categoryObj.has_more && (
                        <div className="w-full flex justify-start mt-4">
                          <button
                            className="px-4 py-1 bg-white text-primary-700 border border-primary-700 rounded hover:bg-primary-700 hover:text-white transition"
                            onClick={() => handleLoadMore(categoryObj.category.id)}
                          >
                            Lihat lebih banyak...
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </main>
    </Template>
  );
}
