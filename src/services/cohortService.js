export const getCohorts = async () => {
  return [
    {
      id: 1,
      name: 'Cohort 1',
      programmeType: 'Law Student Internship',
      startDate: '2026-01-10',
      endDate: '2026-03-30',
      capacity: 50,
      status: 'completed',
      studentsCount: 32,
      revenue: '₦1,800,000',
    },
    {
      id: 2,
      name: 'Cohort 2',
      programmeType: 'Young Lawyer Coaching',
      startDate: '2026-02-15',
      endDate: '2026-05-20',
      capacity: 40,
      status: 'closed',
      studentsCount: 24,
      revenue: '₦2,100,000',
    },
    {
      id: 3,
      name: 'Cohort 3',
      programmeType: 'Law Student Internship',
      startDate: '2026-04-01',
      endDate: '2026-07-15',
      capacity: 60,
      status: 'open',
      studentsCount: 41,
      revenue: '₦2,750,000',
    },
  ]
}