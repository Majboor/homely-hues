
// User Service to manage user state and usage limitations

/**
 * Checks if the user has already used their free design
 */
export const hasUsedFreeDesign = (): boolean => {
  return localStorage.getItem('freeDesignUsed') === 'true';
};

/**
 * Marks that the user has used their free design
 */
export const markFreeDesignAsUsed = (): void => {
  localStorage.setItem('freeDesignUsed', 'true');
};

/**
 * Resets the free design usage (for testing purposes)
 */
export const resetFreeDesignUsage = (): void => {
  localStorage.removeItem('freeDesignUsed');
};
