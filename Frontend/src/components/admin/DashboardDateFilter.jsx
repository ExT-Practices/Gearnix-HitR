import React from "react";

const DashboardDateFilter = ({
    filter,
    setFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    onApply
}) => {
    return (
        <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-end gap-4">

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Date Filter
                    </label>

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                    >
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="custom">Custom Range</option>
                    </select>
                </div>

                {filter === "custom" && (
                    <>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Start Date
                            </label>

                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                End Date
                            </label>

                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                            />
                        </div>
                    </>
                )}

                <button
                    onClick={onApply}
                    className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
                >
                    Apply Filter
                </button>
            </div>
        </div>
    );
};

export default DashboardDateFilter;