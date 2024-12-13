export const getAvatarLetter = (name) => {
  if (name) {
    let b = name.split(" ");
    return b[b.length - 1][0];
  }
  return;
};
