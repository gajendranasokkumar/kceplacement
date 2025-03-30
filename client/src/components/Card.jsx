const Card = ({ children, className, ...props }) => {
  return (
    <div className={`bg-white rounded shadow ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
