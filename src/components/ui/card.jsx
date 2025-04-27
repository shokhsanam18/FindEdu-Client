import * as React from "react";

export const Card = ({ className, children, ...props }) => {
  return (
    <div className={`border-[1px] rounded-[20px] border-black ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children, ...props }) => {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ className, children }) => {
  return <h3 className={`font-lighter text-2xl ${className}`}>{children}</h3>;
};

export const CardDescription = ({ className, children }) => {
  return <p className={`text-md w-1/2 ${className}`}>{children}</p>;
};

export const CardContent = ({ className, children }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

export const CardFooter = ({ className, children }) => {
  return <div className={`flex items-center justify-between p-4 ${className}`}>{children}</div>;
};
