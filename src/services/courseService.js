export const getCourses = async () => {
  return [
    {
      id: 1,
      title: 'Legal Research Fundamentals',
      programmeType: 'Law Student Internship',
      cohort: 'Cohort 3',
      description: 'An introduction to legal research methods, tools, and case analysis.',
      coverImage: '',
      status: 'published',
      contentCount: 4,
      content: [],
    },
    {
      id: 2,
      title: 'Client Communication Mastery',
      programmeType: 'Young Lawyer Coaching',
      cohort: 'Cohort 2',
      description: 'Improve professional communication with clients, firms, and legal teams.',
      coverImage: '',
      status: 'draft',
      contentCount: 2,
      content: [],
    },
    {
      id: 3,
      title: 'Courtroom Ethics and Practice',
      programmeType: 'Law Student Internship',
      cohort: 'Cohort 1',
      description: 'Core ethical and procedural standards for practical legal work.',
      coverImage: '',
      status: 'disabled',
      contentCount: 5,
      content: [],
    },
  ]
}