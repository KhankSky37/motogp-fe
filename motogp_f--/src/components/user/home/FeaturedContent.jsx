import React from 'react';

const FeaturedContent = ({
                             title,
                             description,
                             buttonText,
                             buttonLink,
                             imageUrl,
                             reverse = false,
                         }) => {
    return (
        <section className="py-10 px-6 md:px-16">
            <div
                className={`flex flex-col items-center justify-between gap-10 ${
                    reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'
                }`}
            >
                {/* Text */}
                <div className="max-w-xl w-full">
                    <a href={buttonLink} >
                        <h2 className="text-2xl md:text-3xl font-bold text-black leading-tight cursor-pointer">
                            {title}
                        </h2>
                    </a>
                    <p className="text-gray-700 mt-4 text-xl md:text-base">{description}</p>
                    {buttonText && buttonLink && (
                        <a
                            href={buttonLink}
                            className="inline-block mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            {buttonText}
                        </a>
                    )}
                </div>

                {/* Image */}
                <div className="w-full lg:w-[50%] overflow-hidden">
                    <a href={buttonLink}>
                        <div className="w-full h-full transform scale-125">
                            <img
                                src={imageUrl}
                                alt="Banner"
                                className="w-full h-full object-cover object-center rounded shadow-lg cursor-pointer"
                            />
                        </div>
                    </a>
                </div>

            </div>
        </section>
    );
};

export default FeaturedContent;
