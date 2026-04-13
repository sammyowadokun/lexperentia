export const getAttendanceRecords = async () => {
  return [
    {
      id: 1,
      studentName: 'Samuel Owadokun',
      studentEmail: 'samuel@example.com',
      cohort: 'Cohort 3',
      sessionTitle: 'Internship Orientation',
      date: '2026-04-20',
      status: 'present',
    },
    {
      id: 2,
      studentName: 'Amaka Obi',
      studentEmail: 'amaka@example.com',
      cohort: 'Cohort 2',
      sessionTitle: 'Young Lawyer Strategy Class',
      date: '2026-04-18',
      status: 'absent',
    },
    {
      id: 3,
      studentName: 'David Musa',
      studentEmail: 'david@example.com',
      cohort: 'Cohort 1',
      sessionTitle: 'Career Acceleration Q&A',
      date: '2026-04-10',
      status: 'present',
    },
  ]
}