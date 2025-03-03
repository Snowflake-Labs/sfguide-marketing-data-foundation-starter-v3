import { imagesPathDictionary } from '../utils/GetImagePath';

describe('GetImagePath', () => {
  test('imagesPathDictionary should be an object', () => {
    expect(typeof imagesPathDictionary).toBe('object');
  });

  xtest('imagesPathDictionary should contain image paths', () => {
    const imageKeys = Object.keys(imagesPathDictionary);
    expect(imageKeys.length).toBeGreaterThan(0);

    imageKeys.forEach((key) => {
      expect(typeof imagesPathDictionary[key]).toBe('string');
    });
  });
});
