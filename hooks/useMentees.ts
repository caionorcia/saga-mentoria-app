
import { useState, useEffect, useCallback } from 'react';
import { Mentee, Observation, Task } from '../types';
import { mockMentees, mockInitialMentors } from '../data/mockData';

export const useMentees = () => {
  const [people, setPeople] = useState<Mentee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isConnectedToSheets, setIsConnectedToSheets] = useState<boolean>(false);

  const refreshData = useCallback(() => {
    setLoading(true);
    // Simulate fetching data from an API
    setTimeout(() => {
      try {
        setPeople([...mockMentees, ...mockInitialMentors]);
        setIsConnectedToSheets(Math.random() > 0.3); // Simulate connection status
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    }, 500);
  }, []);

  useEffect(() => {
    refreshData();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updatePerson = useCallback((personId: number, updatedData: Mentee) => {
    setPeople(prevPeople =>
      prevPeople.map(person =>
        person.id === personId ? updatedData : person
      )
    );
  }, []);
  
  const deletePerson = useCallback((personId: number) => {
    setPeople(prevPeople => prevPeople.filter(person => person.id !== personId));
  }, []);

  const addPerson = useCallback((personData: Omit<Mentee, 'id'>) => {
    const newPerson: Mentee = {
      ...personData,
      id: Date.now(), // simple unique id
    };
    setPeople(prevPeople => [newPerson, ...prevPeople]);
  }, []);

  const loadMenteesFromData = useCallback((newMentees: Mentee[]) => {
    setPeople(prevPeople => {
      const existingMentors = prevPeople.filter(p => p.isMentor);
      return [...existingMentors, ...newMentees];
    });
    alert(`${newMentees.length} mentorados foram importados com sucesso!`);
  }, []);


  return {
    people,
    loading,
    error,
    isConnectedToSheets,
    refreshData,
    updatePerson,
    deletePerson,
    addPerson,
    loadMenteesFromData,
  };
};