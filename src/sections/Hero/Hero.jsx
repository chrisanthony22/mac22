import styles from './HeroStyles.module.css';
import heroImg from '../../assets/mac22.svg';
import sun from '../../assets/sun.svg';
import moon from '../../assets/moon.svg';
import twitterDarkIcon from '../../assets/twitter-dark.svg';
import twitterLightIcon from '../../assets/twitter-light.svg';
import githubLigthIcon from '../../assets/github-light.svg';
import githubDarkIcon from '../../assets/github-dark.svg';
import linkedinLightIcon from '../../assets/linkedin-light.svg';
import linkedinDarkIcon from '../../assets/linkedin-dark.svg';
import CV from '../../assets/cv.pdf';
import {useTheme} from '../../common/ThemeContext';
function Hero() {
  const { theme, toggleTheme } =  useTheme(); 

  const themeIcon = theme === 'light' ? sun : moon;
  const twitterIcon = theme === 'light' ? twitterLightIcon : twitterDarkIcon;
  const githubIcon = theme === 'light' ? githubLigthIcon : githubDarkIcon;
  const linkedinIcon = theme === 'light' ? linkedinLightIcon : linkedinDarkIcon;

  return (
    <section id='hero' className={styles.container}>
        <div className={styles.colorModeContainer}>
           <img className={styles.hero} src={heroImg} alt="m@c22" />
           <img 
                className={styles.colorMode} 
                src={themeIcon} 
                alt="color mode icon" 
                onClick={toggleTheme}
           />
        </div>
        <div className={styles.info}>
            <h1>m@c22 </h1>
            <h2>Aspiring Programmer/Developer</h2><br/><hr/><br/>
            <span>
                <a href="https://twitter.com/" target='_blank'>
                    <img src={twitterIcon} alt="twitterIcon" />
                </a>
                <a href="https://github.com/" target='_blank'>
                    <img src={githubIcon} alt="githubIcon" />
                </a>
                <a href="https://www.linkedin.com/in/chris-anthony-monteon" target='_blank'>
                    <img src={linkedinIcon} alt="linkedinIcon" />
                </a>
            </span>
            <p>
                Passionate about developing web and mobile apps and exploring the world of programming.
            </p>
            <a href={CV} download>
                <button className='hover'>Resume</button>
            </a>
        </div>
    </section>
  )
}

export default Hero