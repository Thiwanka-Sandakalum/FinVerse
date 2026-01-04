import { INSTITUTION_MAP } from './constants';

export const getInstitutionName = (institutionId: string): string => {
    return INSTITUTION_MAP[institutionId] || 'Financial Partner';
};
