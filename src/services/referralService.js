export const getReferrals = async () => {
  return [
    {
      id: 1,
      referrerName: 'Samuel Owadokun',
      referrerEmail: 'samuel@example.com',
      cohort: 'Cohort 3',
      totalSignUps: 5,
      paidReferrals: 3,
      unpaidReferrals: 2,
      totalRevenueAttributed: '₦300,000',
      paymentStatus: 'mixed',
      referredUsers: [
        { id: 101, name: 'Ada Nwosu', email: 'ada@example.com', paymentStatus: 'fully paid' },
        { id: 102, name: 'Femi Joseph', email: 'femi@example.com', paymentStatus: 'partial' },
        { id: 103, name: 'Grace Bello', email: 'grace@example.com', paymentStatus: 'fully paid' },
        { id: 104, name: 'Musa Idris', email: 'musa@example.com', paymentStatus: 'unpaid' },
        { id: 105, name: 'Kemi Aina', email: 'kemi@example.com', paymentStatus: 'fully paid' },
      ],
    },
    {
      id: 2,
      referrerName: 'Amaka Obi',
      referrerEmail: 'amaka@example.com',
      cohort: 'Cohort 2',
      totalSignUps: 4,
      paidReferrals: 1,
      unpaidReferrals: 3,
      totalRevenueAttributed: '₦100,000',
      paymentStatus: 'partial',
      referredUsers: [
        { id: 201, name: 'Tope Lawal', email: 'tope@example.com', paymentStatus: 'partial' },
        { id: 202, name: 'Nneka Eze', email: 'nneka@example.com', paymentStatus: 'unpaid' },
        { id: 203, name: 'Victor James', email: 'victor@example.com', paymentStatus: 'unpaid' },
        { id: 204, name: 'Rita Simon', email: 'rita@example.com', paymentStatus: 'fully paid' },
      ],
    },
    {
      id: 3,
      referrerName: 'David Musa',
      referrerEmail: 'david@example.com',
      cohort: 'Cohort 1',
      totalSignUps: 2,
      paidReferrals: 2,
      unpaidReferrals: 0,
      totalRevenueAttributed: '₦200,000',
      paymentStatus: 'paid',
      referredUsers: [
        { id: 301, name: 'Blessing Ojo', email: 'blessing@example.com', paymentStatus: 'fully paid' },
        { id: 302, name: 'Chinedu Okafor', email: 'chinedu@example.com', paymentStatus: 'fully paid' },
      ],
    },
  ]
}