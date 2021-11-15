/**
 * @module cldi
 *
 * @description Clears console and print developer info
 *
 * @requires genConsoleStyles
 */
export default () => {
  /**
   * @description Converts styles object to console compaitble styles string
   *
   * @function
   *
   * @param {Object} styles Styles object
   *
   * @returns {string} Console styles string
   */
  const genConsoleStyles = (styles) =>
    Object.keys(styles)
      .map((key) => {
        const sanitizedKey = `${key
          .split('')
          // eslint-disable-next-line no-confusing-arrow
          .map(
            // eslint-disable-next-line no-confusing-arrow
            (char) =>
              char === char.toUpperCase() ? `-${char.toLowerCase()}` : `${char}`
            // eslint-disable-next-line function-paren-newline
          )
          .join('')}: ${styles[key]};`;

        return sanitizedKey;
      })
      .join(' ');

  console.clear();

  console.log(
    '%cDeveloper man here!',
    genConsoleStyles({
      color: 'white',
      background: 'black',
      fontSize: '16px',
      fontWeight: '600',
      padding: '10px',
    })
  );

  console.log(
    '%cBackground image',
    genConsoleStyles({
      display: 'inline-block',
      background:
        "url('https://media1.giphy.com/media/aNqEFrYVnsS52/giphy.gif?cid=ecf05e47sqeosbhrtjsvhnszags95zb6py8a638sjq8pjjoi&rid=giphy.gif&ct=g')",
      backgroundSize: 'cover',
      padding: '10px 175px 158px 10px',
      borderRadius: '6px',
      color: 'transparent',
    })
  );

  console.log(
    '%cHello there, %cMy name is Merouane, and I love making cool websites, If you have an offer please reach me out though *email* or through the *links* below.\nAlso! Check out my portfolio for more interesting projects.',
    genConsoleStyles({
      display: 'inline-block',
      color: 'white',
      background: 'black',
      fontSize: '16px',
      fontWeight: '600',
      padding: '10px',
    }),
    genConsoleStyles({
      display: 'inline-block',
      color: 'white',
      background: 'black',
      fontSize: '16px',
      padding: '10px',
    })
  );

  console.log(
    '%cMy portfolio:%cwww.merouane-bali-official.it',
    genConsoleStyles({
      color: 'white',
      background: 'black',
      fontSize: '16px',
      fontWeight: '600',
      padding: '5px',
    }),
    genConsoleStyles({
      color: 'white',
      background: 'black',
      fontSize: '16px',
      padding: '5px',
    })
  );

  console.log(
    '%cEmail:%cmerouane.bali.inbox@gmail.com',
    genConsoleStyles({
      color: 'white',
      background: 'black',
      fontSize: '16px',
      fontWeight: '600',
      padding: '5px',
    }),
    genConsoleStyles({
      color: 'white',
      background: 'black',
      fontSize: '16px',
      padding: '5px',
    })
  );

  console.group(
    '%cSocial Links',
    genConsoleStyles({
      color: '#fff',
      background: '#e0005a',
      fontSize: '14px',
      fontWeight: '600',
      padding: '5px',
    })
  );

  console.log(
    '%cFacebook',
    genConsoleStyles({
      color: 'white',
      background: '#4267B2',
      fontSize: '14px',
      fontWeight: '600',
      padding: '5px',
    })
  );
  console.log('www.facebook.com/MerouaneBaliFB');

  console.log(
    '%cLinked In',
    genConsoleStyles({
      color: 'white',
      background: '#0e76a8',
      fontSize: '14px',
      fontWeight: '600',
      padding: '5px',
    })
  );
  console.log('www.linkedin.com/m/merouanebali');

  console.log(
    '%cGitHub',
    genConsoleStyles({
      color: 'white',
      background: 'black',
      fontSize: '14px',
      fontWeight: '600',
      padding: '5px',
    })
  );
  console.log('www.github.com/MerouaneBali');

  console.groupEnd();
};
