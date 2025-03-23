import { supabase } from "@/integrations/supabase/client";

// Types
export interface FavoriteItem {
  id: string;
  user_id: string;
  item_id: string;
  item_type: 'brand-deal' | 'discount-deal';
  created_at: string;
}

// Get all favorites for a user
export async function getUserFavorites(
  userId: string,
  type?: 'brand-deal' | 'discount-deal'
): Promise<FavoriteItem[]> {
  try {
    let query = supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId);
    
    if (type) {
      query = query.eq('item_type', type);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
    
    return data as FavoriteItem[] || [];
  } catch (error) {
    console.error('Error in getUserFavorites:', error);
    return [];
  }
}

// Check if an item is favorited by a user
export async function isItemFavorited(
  userId: string,
  itemId: string,
  itemType: 'brand-deal' | 'discount-deal'
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('item_id', itemId)
      .eq('item_type', itemType)
      .single();
    
    if (error) {
      // If error is not found, it means the item is not favorited
      if (error.code === 'PGRST116') {
        return false;
      }
      console.error('Error checking favorite status:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in isItemFavorited:', error);
    return false;
  }
}

// Add an item to favorites
export async function addToFavorites(
  userId: string,
  itemId: string,
  itemType: 'brand-deal' | 'discount-deal'
): Promise<boolean> {
  try {
    // Check if already favorited
    const alreadyFavorited = await isItemFavorited(userId, itemId, itemType);
    
    if (alreadyFavorited) {
      return true; // Already favorited, no need to add again
    }
    
    const { error } = await supabase
      .from('favorites')
      .insert({
        user_id: userId,
        item_id: itemId,
        item_type: itemType
      });
    
    if (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in addToFavorites:', error);
    return false;
  }
}

// Remove an item from favorites
export async function removeFromFavorites(
  userId: string,
  itemId: string,
  itemType: 'brand-deal' | 'discount-deal'
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('item_id', itemId)
      .eq('item_type', itemType);
    
    if (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in removeFromFavorites:', error);
    return false;
  }
}

// Toggle favorite status
export async function toggleFavorite(
  userId: string,
  itemId: string,
  itemType: 'brand-deal' | 'discount-deal'
): Promise<boolean> {
  try {
    const isFavorited = await isItemFavorited(userId, itemId, itemType);
    
    if (isFavorited) {
      return await removeFromFavorites(userId, itemId, itemType);
    } else {
      return await addToFavorites(userId, itemId, itemType);
    }
  } catch (error) {
    console.error('Error in toggleFavorite:', error);
    return false;
  }
}

// Get favorite items with details
export async function getFavoriteItemsWithDetails(
  userId: string,
  type?: 'brand-deal' | 'discount-deal'
): Promise<any[]> {
  try {
    const favorites = await getUserFavorites(userId, type);
    
    if (favorites.length === 0) {
      return [];
    }
    
    // Group favorites by type
    const brandDealIds: string[] = [];
    const discountDealIds: string[] = [];
    
    favorites.forEach(fav => {
      if (fav.item_type === 'brand-deal') {
        brandDealIds.push(fav.item_id);
      } else {
        discountDealIds.push(fav.item_id);
      }
    });
    
    // Fetch details for each type
    const results: any[] = [];
    
    if (brandDealIds.length > 0 && (!type || type === 'brand-deal')) {
      const { data: brandDeals, error: brandError } = await supabase
        .from('brand_deals')
        .select('*')
        .in('id', brandDealIds);
      
      if (!brandError && brandDeals) {
        results.push(...brandDeals.map(deal => ({
          ...deal,
          item_type: 'brand-deal'
        })));
      }
    }
    
    if (discountDealIds.length > 0 && (!type || type === 'discount-deal')) {
      const { data: discountDeals, error: discountError } = await supabase
        .from('discount_deals')
        .select('*')
        .in('id', discountDealIds);
      
      if (!discountError && discountDeals) {
        results.push(...discountDeals.map(deal => ({
          ...deal,
          item_type: 'discount-deal'
        })));
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error in getFavoriteItemsWithDetails:', error);
    return [];
  }
}

// Local storage fallback for when user is not authenticated
const FAVORITES_KEY = 'creatordeals_favorites';

// Get favorites from local storage
export function getLocalFavorites(): { id: string; type: 'brand-deal' | 'discount-deal' }[] {
  try {
    const favoritesJson = localStorage.getItem(FAVORITES_KEY);
    return favoritesJson ? JSON.parse(favoritesJson) : [];
  } catch (error) {
    console.error('Error getting local favorites:', error);
    return [];
  }
}

// Save favorites to local storage
export function saveLocalFavorite(
  itemId: string,
  itemType: 'brand-deal' | 'discount-deal'
): boolean {
  try {
    const favorites = getLocalFavorites();
    const existingIndex = favorites.findIndex(
      fav => fav.id === itemId && fav.type === itemType
    );
    
    if (existingIndex >= 0) {
      // Already exists, remove it (toggle off)
      favorites.splice(existingIndex, 1);
    } else {
      // Doesn't exist, add it
      favorites.push({ id: itemId, type: itemType });
    }
    
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return true;
  } catch (error) {
    console.error('Error saving local favorite:', error);
    return false;
  }
}

// Check if an item is in local favorites
export function isLocalFavorite(
  itemId: string,
  itemType: 'brand-deal' | 'discount-deal'
): boolean {
  try {
    const favorites = getLocalFavorites();
    return favorites.some(fav => fav.id === itemId && fav.type === itemType);
  } catch (error) {
    console.error('Error checking local favorite:', error);
    return false;
  }
}

// Migrate local favorites to user account
export async function migrateLocalFavoritesToUser(userId: string): Promise<boolean> {
  try {
    const localFavorites = getLocalFavorites();
    
    if (localFavorites.length === 0) {
      return true; // Nothing to migrate
    }
    
    // Add each local favorite to the user's account
    const promises = localFavorites.map(fav => 
      addToFavorites(userId, fav.id, fav.type)
    );
    
    await Promise.all(promises);
    
    // Clear local favorites after migration
    localStorage.removeItem(FAVORITES_KEY);
    
    return true;
  } catch (error) {
    console.error('Error migrating local favorites:', error);
    return false;
  }
} 