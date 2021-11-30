import localizer from './Localization';

export const localizeString = (key, argumentsData) => {
  var string = localizer.translate(key, argumentsData);
  console.log({string});
  return string;
};
