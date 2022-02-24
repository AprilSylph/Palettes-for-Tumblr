const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'medium'
});

export const getDatestamp = () => {
  const now = new Date();

  const fourDigitYear = now.getFullYear().toString().padStart(4, '0');
  const twoDigitMonth = (now.getMonth() + 1).toString().padStart(2, '0');
  const twoDigitDate = now.getDate().toString().padStart(2, '0');

  return `${fourDigitYear}-${twoDigitMonth}-${twoDigitDate}`;
};

export const getTimestamp = paletteKey => {
  const timestamp = parseInt(paletteKey.split(':')[2]);
  const creationDate = new Date(timestamp);
  return dateTimeFormat.format(creationDate);
};

export const isValidDate = value => isNaN((new Date(value)).valueOf()) === false;
