type ImagesDictDef = {
  [key: string]: string;
};

const constructorImagesDictionary = () => {
  try {
    const context = require.context('../assets/Images', true);
    let images: any = {};
    context.keys().forEach((item: string) => {
      images[item.substring(item.lastIndexOf('/') + 1, item.lastIndexOf('.'))] = context(item);
    });
    return images;
  } catch (e) {
    return {};
  }
};

const imagesPathDictionary: ImagesDictDef = {
  ...constructorImagesDictionary(),
};

export { imagesPathDictionary };
