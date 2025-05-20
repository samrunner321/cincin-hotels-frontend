import { test, expect } from '@playwright/test';
import { HotelsListPage, HotelDetailPage } from '../../pages';
import { 
  assertContainsText, 
  assertImageLoaded, 
  assertElementCount,
  getTestHotel
} from '../../utils';

test.describe('Hotel Details and Room Selection', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to hotels list page
    const hotelsPage = new HotelsListPage(page);
    await hotelsPage.goto();
    await hotelsPage.waitForPageLoad();
  });
  
  test('Hotel detail page displays correct content', async ({ page }) => {
    // Setup - get a specific test hotel
    const testHotel = getTestHotel('Hotel Schgaguler');
    expect(testHotel).toBeDefined();
    
    // Navigate to the hotel detail page
    const hotelsPage = new HotelsListPage(page);
    await hotelsPage.clickHotel(testHotel!.name);
    
    // Initialize hotel detail page object
    const hotelDetailPage = new HotelDetailPage(page);
    await hotelDetailPage.waitForPageLoad();
    
    // Verify basic hotel details are displayed
    await hotelDetailPage.verifyHotelDetailPageContent();
    
    // Verify hotel name matches
    const hotelName = await hotelDetailPage.getHotelName();
    expect(hotelName).toContain(testHotel!.name);
    
    // Verify hotel category matches
    const hotelCategory = await hotelDetailPage.getHotelCategory();
    expect(hotelCategory?.toLowerCase()).toContain(testHotel!.category.toLowerCase());
    
    // Verify gallery section is displayed and has images
    await expect(hotelDetailPage.gallerySection).toBeVisible();
    await expect(hotelDetailPage.galleryImages.first()).toBeVisible();
    await assertImageLoaded(hotelDetailPage.galleryImages.first());
    
    // Verify features section is displayed
    await expect(hotelDetailPage.featuresSection).toBeVisible();
    await expect(hotelDetailPage.featureItems.first()).toBeVisible();
    
    // Get and verify feature count
    const features = await hotelDetailPage.getFeatures();
    expect(features.length).toBeGreaterThan(0);
  });
  
  test('Gallery navigation works correctly', async ({ page }) => {
    // Navigate to a hotel detail page
    const hotelsPage = new HotelsListPage(page);
    await hotelsPage.clickHotel('Hotel Aurora');
    
    // Initialize hotel detail page object
    const hotelDetailPage = new HotelDetailPage(page);
    await hotelDetailPage.waitForPageLoad();
    
    // Get the initial image source
    const initialImageSrc = await hotelDetailPage.galleryImages.first().getAttribute('src');
    expect(initialImageSrc).toBeTruthy();
    
    // Browse gallery
    await hotelDetailPage.browseGallery(2);
    
    // Get the new image source
    const newImageSrc = await hotelDetailPage.galleryImages.first().getAttribute('src');
    expect(newImageSrc).toBeTruthy();
    
    // Verify image has changed
    expect(newImageSrc).not.toEqual(initialImageSrc);
  });
  
  test('Content tabs navigation works correctly', async ({ page }) => {
    // Navigate to a hotel detail page
    const hotelsPage = new HotelsListPage(page);
    await hotelsPage.clickHotel('Hotel Giardino');
    
    // Initialize hotel detail page object
    const hotelDetailPage = new HotelDetailPage(page);
    await hotelDetailPage.waitForPageLoad();
    
    // Test overview tab
    await hotelDetailPage.navigateToTab('overview');
    await expect(page.locator('[data-testid="overview-content"]')).toBeVisible();
    
    // Test rooms tab
    await hotelDetailPage.navigateToTab('rooms');
    await expect(page.locator('[data-testid="rooms-content"]')).toBeVisible();
    await expect(hotelDetailPage.roomsList).toBeVisible();
    
    // Test dining tab (if available)
    if (await hotelDetailPage.diningTab.isVisible()) {
      await hotelDetailPage.navigateToTab('dining');
      await expect(page.locator('[data-testid="dining-content"]')).toBeVisible();
    }
    
    // Test location tab (if available)
    if (await hotelDetailPage.locationTab.isVisible()) {
      await hotelDetailPage.navigateToTab('location');
      await expect(page.locator('[data-testid="location-content"]')).toBeVisible();
    }
  });
  
  test('Room list displays available rooms', async ({ page }) => {
    // Navigate to a hotel detail page
    const hotelsPage = new HotelsListPage(page);
    await hotelsPage.clickHotel('Hotel Rockresort');
    
    // Initialize hotel detail page object
    const hotelDetailPage = new HotelDetailPage(page);
    await hotelDetailPage.waitForPageLoad();
    
    // Navigate to rooms tab
    await hotelDetailPage.navigateToRooms();
    
    // Verify room list is displayed
    await expect(hotelDetailPage.roomsList).toBeVisible();
    
    // Verify room cards are displayed
    await expect(hotelDetailPage.roomCards.first()).toBeVisible();
    
    // Verify room count
    const roomCount = await hotelDetailPage.getRoomCount();
    expect(roomCount).toBeGreaterThan(0);
    
    // Verify room information is displayed
    const roomCards = hotelDetailPage.roomCards;
    
    // Check the first room card
    const firstRoomCard = roomCards.first();
    
    // Check room name
    await expect(firstRoomCard.locator('h3, .room-name')).toBeVisible();
    
    // Check room description
    await expect(firstRoomCard.locator('.description, [data-testid="room-description"]')).toBeVisible();
    
    // Check room price
    await expect(firstRoomCard.locator('.price, [data-testid="room-price"]')).toBeVisible();
    
    // Check room image
    await expect(firstRoomCard.locator('img')).toBeVisible();
    await assertImageLoaded(firstRoomCard.locator('img'));
  });
  
  test('Room selection opens room details', async ({ page }) => {
    // Navigate to a hotel detail page
    const hotelsPage = new HotelsListPage(page);
    await hotelsPage.clickHotel('Hotel Aurora');
    
    // Initialize hotel detail page object
    const hotelDetailPage = new HotelDetailPage(page);
    await hotelDetailPage.waitForPageLoad();
    
    // Navigate to rooms tab
    await hotelDetailPage.navigateToRooms();
    
    // Get all room names
    const roomNames = await hotelDetailPage.roomCards.locator('h3, .room-name').allTextContents();
    expect(roomNames.length).toBeGreaterThan(0);
    
    // Select the first room
    const firstRoomName = roomNames[0];
    await hotelDetailPage.selectRoom(firstRoomName);
    
    // Verify room detail is displayed
    await expect(page.locator('[data-testid="room-detail"]')).toBeVisible();
    
    // Verify room detail contains the room name
    await assertContainsText(page.locator('[data-testid="room-detail"]'), firstRoomName);
    
    // Verify room amenities are displayed
    await expect(page.locator('[data-testid="room-amenities"]')).toBeVisible();
    
    // Verify booking options are displayed
    await expect(page.locator('[data-testid="booking-options"]')).toBeVisible();
  });
});