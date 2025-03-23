import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

export interface FavoriteItem {
  id: string;
  type: 'brand-deal' | 'discount-deal';
  title: string;
  imageUrl?: string;
  createdAt: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load favorites from localStorage on mount
  useEffect(() => {
    const loadFavorites = async () => {
      setIsLoading(true);
      try {
        // Check if user is logged in
        const user = localStorage.getItem('user');
        if (!user) {
          console.log('No user found in localStorage');
          setFavorites([]);
          return;
        }

        const userData = JSON.parse(user);
        const userId = userData.id;
        console.log('Loading favorites for user ID:', userId);

        // In a real app with Supabase, you would fetch favorites from the database
        // For now, we'll use localStorage
        const storedFavorites = localStorage.getItem(`favorites_${userId}`);
        if (storedFavorites) {
          const parsedFavorites = JSON.parse(storedFavorites);
          console.log('Loaded favorites from localStorage:', parsedFavorites);
          setFavorites(parsedFavorites);
        } else {
          console.log('No favorites found in localStorage');
          setFavorites([]);
        }
      } catch (error) {
        console.error('Failed to load favorites:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your favorites',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [toast]);

  // Save favorites to localStorage
  const saveFavorites = async (newFavorites: FavoriteItem[]) => {
    try {
      // Check if user is logged in
      const user = localStorage.getItem('user');
      if (!user) {
        console.log('No user found when trying to save favorites');
        toast({
          title: 'Error',
          description: 'You need to be logged in to save favorites',
          variant: 'destructive',
        });
        return false;
      }

      const userData = JSON.parse(user);
      const userId = userData.id;
      console.log('Saving favorites for user ID:', userId, newFavorites);

      // In a real app with Supabase, you would save favorites to the database
      // For now, we'll use localStorage
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
      return true;
    } catch (error) {
      console.error('Failed to save favorites:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your favorites',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Add a favorite
  const addFavorite = async (item: FavoriteItem) => {
    console.log('Adding favorite:', item);
    // Check if already in favorites
    if (favorites.some(fav => fav.id === item.id && fav.type === item.type)) {
      console.log('Item already in favorites');
      toast({
        title: 'Already in favorites',
        description: 'This item is already in your favorites',
      });
      return false;
    }

    const newFavorites = [...favorites, item];
    console.log('New favorites list after adding:', newFavorites);
    const success = await saveFavorites(newFavorites);
    
    if (success) {
      toast({
        title: 'Added to favorites',
        description: 'Item has been added to your favorites',
      });
    }
    
    return success;
  };

  // Remove a favorite
  const removeFavorite = async (id: string, type: 'brand-deal' | 'discount-deal') => {
    console.log('Removing favorite:', { id, type });
    const newFavorites = favorites.filter(
      item => !(item.id === id && item.type === type)
    );
    
    console.log('New favorites list after removal:', newFavorites);
    const success = await saveFavorites(newFavorites);
    
    if (success) {
      toast({
        title: 'Removed from favorites',
        description: 'Item has been removed from your favorites',
      });
    }
    
    return success;
  };

  // Check if an item is in favorites
  const isFavorite = (id: string, type: 'brand-deal' | 'discount-deal') => {
    const result = favorites.some(item => item.id === id && item.type === type);
    console.log('Checking if item is favorite:', { id, type, result });
    return result;
  };

  // Toggle favorite status
  const toggleFavorite = async (item: FavoriteItem) => {
    console.log('Toggle favorite for:', item);
    if (isFavorite(item.id, item.type)) {
      return await removeFavorite(item.id, item.type);
    } else {
      return await addFavorite(item);
    }
  };

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };
} 