// Mock data for the Real Estate Calling app
export const mockCalls = [
  {
    id: '1',
    name: 'John Smith',
    phone: '+1 (555) 123-4567',
    status: 'successful',
    lastCallTime: '2:30 PM',
    callCount: 1,
    notes: 'Interested in 3-bedroom house',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    phone: '+1 (555) 234-5678',
    status: 'unsuccessful',
    lastCallTime: '1:45 PM',
    callCount: 2,
    notes: 'No answer, will try again tomorrow',
  },
  {
    id: '3',
    name: 'Mike Davis',
    phone: '+1 (555) 345-6789',
    status: 'successful',
    lastCallTime: '12:20 PM',
    callCount: 1,
    notes: 'Looking for investment property',
  },
  {
    id: '4',
    name: 'Emily Wilson',
    phone: '+1 (555) 456-7890',
    status: 'unsuccessful',
    lastCallTime: '11:15 AM',
    callCount: 3,
    notes: 'Busy signal, will reschedule',
  },
  {
    id: '5',
    name: 'David Brown',
    phone: '+1 (555) 567-8901',
    status: 'successful',
    lastCallTime: '10:30 AM',
    callCount: 1,
    notes: 'Wants to sell current home first',
  },
  {
    id: '6',
    name: 'Lisa Anderson',
    phone: '+1 (555) 678-9012',
    status: 'unsuccessful',
    lastCallTime: '9:45 AM',
    callCount: 2,
    notes: 'Wrong number',
  },
  {
    id: '7',
    name: 'Robert Taylor',
    phone: '+1 (555) 789-0123',
    status: 'successful',
    lastCallTime: 'Yesterday',
    callCount: 1,
    notes: 'Interested in condo',
  },
  {
    id: '8',
    name: 'Jennifer Martinez',
    phone: '+1 (555) 890-1234',
    status: 'unsuccessful',
    lastCallTime: 'Yesterday',
    callCount: 1,
    notes: 'Not interested at this time',
  },
  {
    id: '9',
    name: 'Michael Thompson',
    phone: '+1 (555) 901-2345',
    status: 'successful',
    lastCallTime: 'Yesterday',
    callCount: 1,
    notes: 'Wants to schedule viewing',
  },
  {
    id: '10',
    name: 'Amanda Garcia',
    phone: '+1 (555) 012-3456',
    status: 'unsuccessful',
    lastCallTime: 'Yesterday',
    callCount: 2,
    notes: 'Will call back later',
  },
];

// Helper function to filter calls by status
export const filterCallsByStatus = (calls, status) => {
  if (status === 'all') return calls;
  return calls.filter(call => call.status === status);
};

// Helper function to get call statistics
export const getCallStats = (calls) => {
  const total = calls.length;
  const successful = calls.filter(call => call.status === 'successful').length;
  const unsuccessful = calls.filter(call => call.status === 'unsuccessful').length;
  
  return {
    total,
    successful,
    unsuccessful,
    successRate: total > 0 ? Math.round((successful / total) * 100) : 0
  };
};
