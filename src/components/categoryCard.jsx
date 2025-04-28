import Icon from './icon/iconHeroicons';

export default function CategoryCard({ category }) {
  return (
    <div className="w-72 h-24 bg-white shadow-xl rounded-lg flex overflow-hidden">
      <img className="h-full w-24 object-cover" src={category.imageUrl} alt={category.name} />
      <div className="w-full flex justify-between items-center">
        <div className="w-3/4 flex flex-col justify-center ml-4">
          <h1 className="text-2xl font-bold">{category.name}</h1>
          <p className="text-md text-gray-600">{category.many} Courses</p>
        </div>
        <div className="flex justify-start w-1/4">
          <Icon type={'arrow-right'} />
        </div>
      </div>
    </div>
  );
}
