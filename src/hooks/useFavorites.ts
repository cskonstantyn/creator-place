import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

// Types
type FavoriteItemType = 'brand-deal' | 'discount-deal';

interface FavoriteItem {
  id: string;
  type: FavoriteItemType;
}

// Local storage key
const FAVORITES_KEY = 'creatordeals_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get user ID from local storage
  const getUserId = () => localStorage.getItem('userId');
  
  // Load favorites from local storage
  const loadFavorites = useCallback(() => {
    try {
      const favoritesJson = localStorage.getItem(FAVORITES_KEY);
      const loadedFavorites = favoritesJson ? JSON.parse(favoritesJson) : [];
      setFavorites(loadedFavorites);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
      setIsLoading(false);
    }
  }, []);
  
  // Save favorites to local storage
  const saveFavorites = useCallback((newFavorites: FavoriteItem[]) => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, []);
  
  // Check if an item is favorited
  const isFavorite = useCallback((itemId: string, itemType: FavoriteItemType) => {
    return favorites.some(fav => fav.id === itemId && fav.type === itemType);
  }, [favorites]);
  
  // Toggle favorite status
  const toggleFavorite = useCallback((itemId: string, itemType: FavoriteItemType) => {
    try {
      const newFavorites = [...favorites];
      const existingIndex = newFavorites.findIndex(
        fav => fav.id === itemId && fav.type === itemType
      );
      
      if (existingIndex >= 0) {
        // Remove from favorites
        newFavorites.splice(existingIndex, 1);
        toast.success('Removed from favorites');
      } else {
        // Add to favorites
        newFavorites.push({ id: itemId, type: itemType });
        toast.success('Added to favorites');
      }
      
      saveFavorites(newFavorites);
      return true;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
      return false;
    }
  }, [favorites, saveFavorites]);
  
  // Get favorites by type
  const getFavoritesByType = useCallback((type?: FavoriteItemType) => {
    if (!type) return favorites;
    return favorites.filter(fav => fav.type === type);
  }, [favorites]);
  
  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);
  
  return {
    favorites,
    isLoading,
    isFavorite,
    toggleFavorite,
    getFavoritesByType
  };
} 