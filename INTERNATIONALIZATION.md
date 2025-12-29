# Internationalization (i18n) Guide

This document provides guidelines and best practices for implementing internationalization in the Splitter application.

## Internationalization Strategy

The Splitter application supports multiple languages and locales to provide a global user experience. The implementation follows industry best practices for internationalization.

## Supported Languages

Currently supported languages:
- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Japanese (ja)
- Chinese (Simplified) (zh-CN)
- Chinese (Traditional) (zh-TW)

## Implementation Approach

### Backend Internationalization

#### Error Messages
``typescript
// Example of internationalized error messages
const errorMessages = {
  en: {
    USER_NOT_FOUND: 'User not found',
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_EXISTS: 'Email already exists',
  },
  es: {
    USER_NOT_FOUND: 'Usuario no encontrado',
    INVALID_CREDENTIALS: 'Correo electrónico o contraseña inválidos',
    EMAIL_EXISTS: 'El correo electrónico ya existe',
  },
  fr: {
    USER_NOT_FOUND: 'Utilisateur non trouvé',
    INVALID_CREDENTIALS: 'Email ou mot de passe invalide',
    EMAIL_EXISTS: 'L\'email existe déjà',
  },
};

export const getErrorMessage = (key: string, locale: string = 'en'): string => {
  return errorMessages[locale]?.[key] || errorMessages['en'][key] || key;
};
```

#### API Response Localization
``typescript
// Example of localized API responses
interface LocalizedResponse {
  message: string;
  localizedMessages: Record<string, string>;
}

const createLocalizedResponse = (
  defaultMessage: string,
  translations: Record<string, string>
): LocalizedResponse => ({
  message: defaultMessage,
  localizedMessages: translations,
});
```

### Frontend Internationalization

#### Translation System
``typescript
// Example of translation service
import AsyncStorage from '@react-native-async-storage/async-storage';

class I18nService {
  private translations: Record<string, any> = {};
  private currentLocale: string = 'en';

  async init() {
    // Load user's preferred language
    const savedLocale = await AsyncStorage.getItem('locale');
    this.currentLocale = savedLocale || this.detectLocale();
    
    // Load translations
    await this.loadTranslations(this.currentLocale);
  }

  private detectLocale(): string {
    // Detect system locale or use default
    return 'en';
  }

  async loadTranslations(locale: string) {
    try {
      const translations = await import(`../locales/${locale}.json`);
      this.translations[locale] = translations.default;
    } catch (error) {
      console.warn(`Failed to load translations for ${locale}`, error);
      // Fallback to English
      const translations = await import(`../locales/en.json`);
      this.translations[locale] = translations.default;
    }
  }

  async setLocale(locale: string) {
    await this.loadTranslations(locale);
    this.currentLocale = locale;
    await AsyncStorage.setItem('locale', locale);
  }

  t(key: string, params?: Record<string, any>): string {
    let translation = this.translations[this.currentLocale]?.[key] || key;
    
    // Replace parameters
    if (params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{{${param}}}`, params[param]);
      });
    }
    
    return translation;
  }

  getLocale(): string {
    return this.currentLocale;
  }
}

export const i18n = new I18nService();
```

#### Component Implementation
``tsx
// Example of using translations in components
import React, { useContext } from 'react';
import { Text, View } from 'react-native';
import { i18n } from '../services/i18n.service';

interface Props {
  expenseAmount: number;
  userName: string;
}

const ExpenseSummary: React.FC<Props> = ({ expenseAmount, userName }) => {
  return (
    <View>
      <Text>
        {i18n.t('expense_summary', {
          amount: expenseAmount.toFixed(2),
          user: userName,
        })}
      </Text>
      <Text>{i18n.t('total_expenses')}</Text>
    </View>
  );
};

export default ExpenseSummary;
```

#### Locale-Specific Formatting
``typescript
// Example of locale-specific formatting
class LocaleFormatter {
  static formatCurrency(amount: number, locale: string, currency: string = 'USD'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  static formatDate(date: Date, locale: string): string {
    return new Intl.DateTimeFormat(locale).format(date);
  }

  static formatNumber(number: number, locale: string): string {
    return new Intl.NumberFormat(locale).format(number);
  }
}

// Usage
const formattedAmount = LocaleFormatter.formatCurrency(1234.56, 'en-US', 'USD');
const formattedDate = LocaleFormatter.formatDate(new Date(), 'es-ES');
```

## Translation Management

### Translation Files Structure
```
src/
├── locales/
│   ├── en.json
│   ├── es.json
│   ├── fr.json
│   ├── de.json
│   ├── ja.json
│   ├── zh-CN.json
│   └── zh-TW.json
└── services/
    └── i18n.service.ts
```

### Sample Translation File (en.json)
```json
{
  "app_name": "Splitter",
  "welcome": "Welcome",
  "login": "Login",
  "register": "Register",
  "email": "Email",
  "password": "Password",
  "name": "Name",
  "logout": "Logout",
  "dashboard": "Dashboard",
  "groups": "Groups",
  "expenses": "Expenses",
  "balances": "Balances",
  "profile": "Profile",
  "settings": "Settings",
  "add_expense": "Add Expense",
  "edit_expense": "Edit Expense",
  "delete_expense": "Delete Expense",
  "expense_summary": "{{user}} owes {{amount}}",
  "total_expenses": "Total Expenses",
  "group_members": "Group Members",
  "add_member": "Add Member",
  "remove_member": "Remove Member",
  "settle_up": "Settle Up",
  "notifications": "Notifications",
  "language": "Language",
  "currency": "Currency",
  "dark_mode": "Dark Mode",
  "help_support": "Help & Support",
  "terms_of_service": "Terms of Service",
  "privacy_policy": "Privacy Policy"
}
```

### Translation Workflow

#### Adding New Translations
1. Add new keys to the base language file (en.json)
2. Create translation tickets for other languages
3. Update all language files with new translations
4. Test translations in the application

#### Managing Translation Updates
1. Use translation management tools (e.g., Crowdin, Transifex)
2. Implement continuous localization workflow
3. Review translations for cultural appropriateness
4. Test updated translations thoroughly

## Cultural Considerations

### Date and Time Formatting
``typescript
// Example of locale-specific date formatting
const formatDate = (date: Date, locale: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  
  return new Intl.DateTimeFormat(locale, options).format(date);
};

// Usage examples
formatDate(new Date(), 'en-US'); // December 25, 2023 at 03:30 PM
formatDate(new Date(), 'de-DE'); // 25. Dezember 2023 um 15:30
formatDate(new Date(), 'ja-JP'); // 2023年12月25日 15:30
```

### Number Formatting
``typescript
// Example of locale-specific number formatting
const formatNumber = (number: number, locale: string): string => {
  return new Intl.NumberFormat(locale).format(number);
};

// Usage examples
formatNumber(1234.56, 'en-US'); // 1,234.56
formatNumber(1234.56, 'de-DE'); // 1.234,56
formatNumber(1234.56, 'fr-FR'); // 1 234,56
```

### Currency Formatting
``typescript
// Example of locale-specific currency formatting
const formatCurrency = (amount: number, locale: string, currency: string): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Usage examples
formatCurrency(1234.56, 'en-US', 'USD'); // $1,234.56
formatCurrency(1234.56, 'de-DE', 'EUR'); // 1.234,56 €
formatCurrency(1234.56, 'ja-JP', 'JPY'); // ¥1,235
```

## Right-to-Left (RTL) Support

### RTL Layout Implementation
``tsx
// Example of RTL support
import { I18nManager, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
  },
  text: {
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
});

// Dynamic styling based on locale
const getDynamicStyles = (isRTL: boolean) => ({
  container: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
  },
  icon: {
    marginRight: isRTL ? 0 : 10,
    marginLeft: isRTL ? 10 : 0,
  },
});
```

### RTL Testing
1. Test with RTL languages (Arabic, Hebrew)
2. Verify layout direction changes
3. Check text alignment
4. Validate icon positioning

## Performance Considerations

### Translation Loading
``typescript
// Example of efficient translation loading
class TranslationService {
  private cache: Map<string, any> = new Map();
  
  async loadTranslations(locale: string) {
    // Check cache first
    if (this.cache.has(locale)) {
      return this.cache.get(locale);
    }
    
    // Load translations
    try {
      const translations = await import(`../locales/${locale}.json`);
      this.cache.set(locale, translations.default);
      return translations.default;
    } catch (error) {
      // Fallback to English
      const translations = await import(`../locales/en.json`);
      this.cache.set(locale, translations.default);
      return translations.default;
    }
  }
}
```

### Bundle Size Optimization
1. Code-split translations by language
2. Load translations on-demand
3. Use tree-shaking for unused translations
4. Compress translation files

## Testing Internationalization

### Automated Testing
``typescript
// Example of i18n testing
import { i18n } from '../services/i18n.service';

describe('Internationalization', () => {
  beforeEach(async () => {
    await i18n.init();
  });

  test('should translate keys correctly', () => {
    i18n.setLocale('en');
    expect(i18n.t('welcome')).toBe('Welcome');
    
    i18n.setLocale('es');
    expect(i18n.t('welcome')).toBe('Bienvenido');
  });

  test('should handle missing translations', () => {
    i18n.setLocale('en');
    expect(i18n.t('nonexistent_key')).toBe('nonexistent_key');
  });

  test('should replace parameters', () => {
    i18n.setLocale('en');
    expect(i18n.t('expense_summary', { user: 'John', amount: '25.00' }))
      .toBe('John owes 25.00');
  });
});
```

### Manual Testing
1. Test all supported languages
2. Verify date and number formatting
3. Check RTL layout support
4. Validate cultural appropriateness

## Continuous Localization

### Integration with Translation Platforms
1. Set up continuous integration with translation management tools
2. Automate translation file updates
3. Implement translation quality checks
4. Monitor translation progress

### Localization Workflow
1. Extract strings for translation
2. Upload to translation platform
3. Translate strings
4. Download updated translation files
5. Integrate into application
6. Test translations

## Best Practices

### String Management
1. Use descriptive key names
2. Avoid concatenating translated strings
3. Use parameterized translations
4. Maintain consistent terminology

### Cultural Sensitivity
1. Consider cultural differences in design
2. Adapt content for local customs
3. Respect religious and political sensitivities
4. Use appropriate imagery and colors

### Performance
1. Lazy load translations
2. Cache frequently used translations
3. Optimize bundle size
4. Minimize translation file sizes

## Future Considerations

### Expanding Language Support
1. Research target markets
2. Prioritize high-impact languages
3. Consider regional dialects
4. Plan for scalability

### Advanced Features
1. Machine translation integration
2. User-contributed translations
3. Context-aware translations
4. Voice and speech localization

By following these internationalization guidelines, the Splitter application can effectively serve users around the world while maintaining a consistent and culturally appropriate user experience.