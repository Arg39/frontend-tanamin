import { Link } from 'react-router-dom';
import Card from '../components/card/card';
import CategoryCard from '../components/card/categoryCard';
import Icon from '../components/icon/iconHeroicons';
import MiniCard from '../components/card/miniCard';
import CardInstructor from '../components/card/cardInstructor';
import FilterCard from '../components/card/filterCard';
import LargeCard from '../components/card/largeCard';
import { categories } from '../routes/categories';
import Navbar from '../components/navigation/navbar';

export default function Beranda() {
  const course = {
    image:
      'https://cpr.heart.org/-/media/CPR-Images/Find-a-Course/AHA-IAN-3940-HiRes-find-a-course.jpg?h=641&iar=0&mw=960&w=960&sc_lang=en',
    title: 'Full Stack JavaScript Next JS Developer: Build Job Portal Website ',
    rating: 4,
    lotMaterial: 3,
    duration: 4,
    participant: 100,
    instructor: 'John Doe',
    price: 199000,
    priceBeforeDiscount: 399000,
    categry: 'Fullstack',
  };

  const popularCategories = [
    {
      name: 'React',
      imageUrl: 'https://pbs.twimg.com/profile_images/1785867863191932928/EpOqfO6d_400x400.png',
      many: 20,
    },
    {
      name: 'Laravel',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Laravel.svg/1200px-Laravel.svg.png',
      many: 15,
    },
    {
      name: 'Vue-Js',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/640px-Vue.js_Logo_2.svg.png',
      many: 10,
    },
    {
      name: 'Python',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png',
      many: 25,
    },
    {
      name: 'Python',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png',
      many: 25,
    },
    {
      name: 'Python',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png',
      many: 25,
    },
    {
      name: 'Python',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png',
      many: 25,
    },
    {
      name: 'Python',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png',
      many: 25,
    },
  ];

  const instructors = [
    {
      name: 'Jane Smith',
      profilePict:
        'https://plus.unsplash.com/premium_photo-1678197937465-bdbc4ed95815?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      courseSpecific: 'React',
      manyHeld: 10,
    },
    {
      name: 'John Doe',
      profilePict: 'https://example.com/john.jpg',
      courseSpecific: 'Vue.js',
      manyHeld: 8,
    },
    {
      name: 'Alice Johnson',
      profilePict: 'https://example.com/alice.jpg',
      courseSpecific: 'Python',
      manyHeld: 15,
    },
    {
      name: 'Bob Brown',
      profilePict: 'https://example.com/bob.jpg',
      courseSpecific: 'Laravel',
      manyHeld: 12,
    },
    {
      name: 'Charlie Davis',
      profilePict: 'https://example.com/charlie.jpg',
      courseSpecific: 'JavaScript',
      manyHeld: 9,
    },
  ];

  return (
    <div
      className="h-screen bg-gradient-to-t"
      style={{
        backgroundImage: 'linear-gradient(to top, #AF391033 40%, white 100%)',
      }}
    >
      <Navbar page={'beranda'} categories={categories} userName="Alfian" />
      <div className="mt-20">
        <div className="px-52 mt-40">
          <div className="flex justify-between">
            <div className="w-2/3 ">
              <p className="p-2 px-4 rounded-full bg-[#AF391033] items-center max-w-fit text-xl text-[#AF3910]">
                Welcome to Codelearn
              </p>
              <h1 className="text-5xl font-semibold mt-32">
                Platform{' '}
                <span className="bg-gradient-to-l from-[#0097A9] to-[#AF3910] bg-clip-text text-transparent">
                  Online Course
                </span>{' '}
                Terbaik <br /> Untuk Mendorong Karir Anda
              </h1>
              <p className="text-4xl font-extralight mt-20">
                {' '}
                Jelajahi course terbaik dengan materi berkualitas <br />
                dan instruktur profesional
              </p>
              <p className="p-2 px-8 mt-20 rounded-full bg-[#AF3910] items-center max-w-fit text-2xl text-[#ffffff] font-medium">
                Jelajahi Course
              </p>
            </div>
            <div className="w-1/3 flex justify-start items-center relative">
              {Array(3)
                .fill()
                .map((_, index) => (
                  <div
                    key={index}
                    className="absolute shadow-lg"
                    style={{
                      marginLeft: `${20 - index * 20}px`,
                      marginBottom: `${4 - index * 8}px`,
                      transform: `rotate(${5 - index * 2.5}deg)`,
                    }}
                  >
                    <Card course={course} content={index === 2} />
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="w-full h-full mt-52 px-52 bg-gray-100 pt-32 rorunded">
          <h2 className="text-black font-semibold text-4xl">Kategori Populer</h2>
          <div className="w-full mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {popularCategories.slice(0, 8).map((category, index) => (
              <CategoryCard key={index} category={category} />
            ))}
          </div>

          <h2 className="mt-32 text-black font-semibold text-4xl">Teratas minggu ini</h2>
          <div className="mt-14">
            <MiniCard course={course} />
          </div>
          <div className="mt-32 flex justify-between items-end">
            <div className="w-full">
              <p className="text-black font-semibold text-4xl">Instruktur Kami</p>
            </div>
            <Link to={''} className="w-full flex justify-end items-center hover:underline">
              <p className="h-full">lihat selengkapnya</p>
              <Icon type={'arrow-right'} className={'size-3 ml-2 h-full flex'} />
            </Link>
          </div>
          <div className="mt-14 flex space-x-8">
            {instructors.map((instructor, index) => (
              <CardInstructor instructor={instructor} />
            ))}
          </div>
          <h2 className="mt-32 text-black font-semibold text-4xl">
            Temukan Course Sesuai Bidang Anda
          </h2>
          <div className="mt-14 flex justify-between">
            <div className="w-3/12 h-full sticky top-24 overflow-y-auto max-h-[calc(100vh-6rem)] pb-2 scrollbar-hide">
              <FilterCard
                showAll={true}
                categories={categories}
                handleCheckboxChange={(index) => console.log(index)}
                course={course}
              />
            </div>
            <div className="w-9/12 pl-8 flex justify-end">
              <div className="w-full grid grid-cols-3 gap-12">
                {Array(10)
                  .fill()
                  .map((_, index) => (
                    <Card key={index} course={course} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
