import React, { useEffect } from 'react';
import Template from '../../../../template/template';
import Breadcrumb from '../../../../components/breadcrumb/breadcrumb';
import { useLocation, useParams } from 'react-router-dom';
import OutlineCourseCard from '../../../../components/card/outlineCourseCard';
import useModuleStore from '../../../../zustand/public/course/learning/moduleStore';

export default function LearningCourse() {
  const location = useLocation();
  const courseId = useParams().courseId;
  const { modules, loading, error, fetchModules } = useModuleStore();

  useEffect(() => {
    if (courseId) fetchModules(courseId);
    // eslint-disable-next-line
  }, [courseId]);

  const breadcrumbItems = [
    { label: 'Tanamin Course', path: '/beranda' },
    { label: 'Kursus', path: `/kursus/${courseId}` },
    { label: 'Belajar Kursus', path: location.pathname },
  ];

  return (
    <div>
      <Template activeNav="kursus.kursus" locationKey={location.key}>
        <main className="min-h-screen bg-white xl:px-24 lg:px-16 md:px-10 sm:px-6 px-4 pt-8 w-full mb-8">
          <Breadcrumb items={breadcrumbItems} />
          <div className="flex-1 w-full mt-16">
            <div className="flex">
              <div className="w-1/4">
                <div className="pr-4">
                  <OutlineCourseCard modules={modules} loading={loading} error={error} />
                </div>
              </div>
              <div className="w-3/4">
                <p>test</p>
              </div>
            </div>
          </div>
        </main>
      </Template>
    </div>
  );
}
