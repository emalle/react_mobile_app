import { I18n } from 'i18n-js';

const i18n = new I18n({
    en: {
        login: "Log In",
        signup: "Sign Up",
        noAccount: "Don't have an account?",
        welcome: "Welcome!",
        rememberMe: "Remember Me",
        searchByCity: "Search by city",
        noConcertsFound: "Sorry, no Concerts Found!",
        searchByGenre: "Search by genre"
    },
    fi: {
        login: "Kirjaudu sisään",
        signup: "Rekisteröidy",
        noAccount: "Eikö sinulla ole tiliä?",
        welcome: "Tervetuloa!",
        rememberMe: "Muista Minut",
        searchByCity: "Etsi kaupunkia",
        noConcertsFound: "Ei löytynyt konsertteja!",
        searchByGenre: "Haku Lajityypeittäin"
    },
    sv: {
        login: "Logga in",
        signup: "Registrera dig",
        noAccount: "Har du inget konto?",
        welcome: "Välkommen!",
        rememberMe: "Kom Ihåg Mig",
        searchByCity: "Sök efter stad",
        noConcertsFound: "Tyvärr, inga konserter hittades!",
        searchByGenre: "Sök efter genre"
    }
});

i18n.defaultLocale = 'en';
i18n.locale = 'en';
i18n.fallbacks = true;

export default i18n;
