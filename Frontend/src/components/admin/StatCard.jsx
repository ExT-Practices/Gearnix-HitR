const StatCard = ({
    title,
    value,
    icon,
    description,
    color = "bg-gray-100 text-gray-700"
}) => {
    return (
        <div className="rounded-xl bg-white p-5 shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">
                        {title}
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-gray-800">
                        {value}
                    </h2>

                    {description && (
                        <p className="mt-2 text-xs text-gray-400">
                            {description}
                        </p>
                    )}
                </div>

                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${color}`}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatCard;