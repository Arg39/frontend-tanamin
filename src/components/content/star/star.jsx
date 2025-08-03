import Icon from '../../icons/icon';

const StarRating = ({ value = 0, className = '', size = 8 }) => {
  const sizeClass = `w-${size} h-${size}`;
  return (
    <div className={`flex items-center ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => {
        if (value >= i + 1) {
          return <Icon key={i} type="star" className={`${sizeClass} text-tertiary-500`} />;
        } else if (value > i && value < i + 1) {
          // Half star (left half gold, right half border)
          return (
            <span key={i} className={`relative inline-block ${sizeClass}`}>
              <Icon
                type="star-rounded"
                className={`absolute left-0 top-0 ${sizeClass} text-tertiary-500`}
                style={{ clipPath: 'inset(0 50% 0 0)' }}
              />
              <Icon
                type="star-outline-rounded"
                className={`absolute left-0 top-0 ${sizeClass} text-tertiary-500`}
                style={{ clipPath: 'inset(0 0 0 50%)' }}
              />
            </span>
          );
        } else {
          return (
            <Icon
              key={i}
              type="star-outline-rounded"
              className={`${sizeClass} text-tertiary-500`}
            />
          );
        }
      })}
    </div>
  );
};

export default StarRating;
