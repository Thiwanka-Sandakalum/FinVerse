import { InstitutionTypeRepository, InstitutionTypeCreateDto, InstitutionTypeUpdateDto } from '../repositories/institution-type.repository';

export class InstitutionTypeService {
    private institutionTypeRepository: InstitutionTypeRepository;

    constructor() {
        this.institutionTypeRepository = new InstitutionTypeRepository();
    }

    /**
     * Get all institution types
     */
    async getAllInstitutionTypes() {
        return this.institutionTypeRepository.findAll();
    }

    /**
     * Get institution type by ID
     */
    async getInstitutionTypeById(id: string) {
        const institutionType = await this.institutionTypeRepository.findById(id);

        if (!institutionType) {
            throw new Error(`Institution type with ID ${id} not found`);
        }

        return institutionType;
    }

    /**
     * Create a new institution type
     */
    async createInstitutionType(data: InstitutionTypeCreateDto) {
        // Check if code already exists
        const existingType = await this.institutionTypeRepository.findByCode(data.code);
        if (existingType) {
            throw new Error(`Institution type with code ${data.code} already exists`);
        }

        return this.institutionTypeRepository.create(data);
    }

    /**
     * Update an institution type
     */
    async updateInstitutionType(id: string, data: InstitutionTypeUpdateDto) {
        // Check if institution type exists
        const institutionType = await this.institutionTypeRepository.findById(id);
        if (!institutionType) {
            throw new Error(`Institution type with ID ${id} not found`);
        }

        return this.institutionTypeRepository.update(id, data);
    }

    /**
     * Delete an institution type
     */
    async deleteInstitutionType(id: string) {
        // Check if institution type exists
        const institutionType = await this.institutionTypeRepository.findById(id);
        if (!institutionType) {
            throw new Error(`Institution type with ID ${id} not found`);
        }

        // Check if there are any institutions using this type
        if (institutionType.institutions.length > 0) {
            throw new Error(`Cannot delete institution type with ID ${id} as it is being used by ${institutionType.institutions.length} institutions`);
        }

        return this.institutionTypeRepository.delete(id);
    }
}
