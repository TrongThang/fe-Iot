"use client"

import GroupCard from "./GroupCard"

const GroupCardExamples = () => {
    return (
        <div className="space-y-6 p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Family Card Variations</h2>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Detailed Layout With Actions</h3>
                <GroupCard
                    familyName="Family A"
                    memberCount={5}
                    type="Work"
                    variant="detailed"
                    showActions={true}
                    onDelete={() => alert("Delete Family A")}
                    onEdit={() => alert("Edit Family A")}
                    onClick={() => alert("View Family A details")}
                />
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Detailed Layout No Actions</h3>
                <GroupCard
                    familyName="Family B"
                    memberCount={3}
                    type="Personal"
                    variant="detailed"
                    onClick={() => alert("View Family B details")}
                />
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Simple Layout</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <GroupCard
                        familyName="Family A"
                        memberCount={5}
                        type="Family"
                        variant="simple"
                        onClick={() => alert("View Family A")}
                    />
                    <GroupCard
                        familyName="Family C"
                        memberCount={8}
                        type="Work"
                        variant="simple"
                        onClick={() => alert("View Family C")}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Grid Layout Example</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { name: "Family A", count: 5, type: "Family" },
                        { name: "Family B", count: 3, type: "Work" },
                        { name: "Family C", count: 7, type: "Friends" },
                        { name: "Family D", count: 4, type: "Family" },
                        { name: "Family E", count: 6, type: "Work" },
                        { name: "Family F", count: 2, type: "Personal" },
                    ].map((family, index) => (
                        <GroupCard
                            key={index}
                            familyName={family.name}
                            memberCount={family.count}
                            type={family.type}
                            variant="simple"
                            onClick={() => alert(`View ${family.name}`)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default GroupCardExamples
