import { useMemo } from 'react';

export interface JobFieldOption {
  value: string;
  label: string;
}

// This maps to your backend JobField enum
const JOB_FIELD_ENUM = [
  'SoftwareDevelopment',
  'DataScience',
  'Marketing',
  'CivilEngineering',
  'AerospaceEngineering',
  'HumanResources',
  'HealthcareIT',
  'ProductManagement',
  'Architecture',
  'ManufacturingEngineering',
  'ElectricalEngineering',
  'MechanicalEngineering',
  'Finance',
  'Accounting',
  'Sales',
  'CustomerService',
  'Legal',
  'Education',
  'ResearchAndDevelopment',
  'Logistics',
  'SupplyChain',
  'Operations',
  'BusinessAnalysis',
  'GraphicDesign',
  'UXUIDesign',
  'ContentWriting',
  'PublicRelations',
  'QualityAssurance',
  'NetworkAdministration',
  'CyberSecurity',
  'DatabaseAdministration',
  'MobileDevelopment',
  'CloudEngineering',
  'EnvironmentalEngineering',
  'ChemicalEngineering',
  'BiomedicalEngineering',
  'SocialWork',
  'Nursing',
  'Pharmacy',
  'MedicalDoctor',
  'Veterinary',
  'ConstructionManagement',
  'RealEstate',
  'Hospitality',
  'EventManagement',
  'RetailManagement',
  'Transportation',
  'Agriculture',
  'FoodScience',
  'Journalism',
  'MediaProduction',
  'Animation',
  'GameDevelopment',
  'DataEngineering',
  'DevOps',
  'ArtificialIntelligence',
  'MachineLearning',
  'Robotics',
  'Blockchain',
  'ECommerce',
  'DigitalMarketing',
  'Translation',
  'FitnessTraining',
  'Psychology',
  'HumanResourcesDevelopment',
  'Security',
  'Maritime',
  'Aviation',
  'Mining',
  'OilAndGas',
  'RenewableEnergy',
  'UrbanPlanning',
  'FashionDesign',
  'Photography',
  'FilmProduction',
  'MusicProduction',
  'Acting',
  'Archaeology',
  'MuseumCuration',
  'LibraryScience',
  'PoliticalScience',
  'Sociology',
  'Anthropology',
  'Theology',
  'Philosophy',
  'BehaviorAnalysis',
  'ABATherapy',
  'SpeechTherapy',
  'OccupationalTherapy',
  'PhysicalTherapy',
  'ChildPsychology',
  'SpecialEducation',
  'Dentistry',
  'Optometry',
  'Radiology',
  'Anesthesiology',
  'Cardiology',
  'Neurology',
  'Geriatrics',
  'Midwifery',
  'Epidemiology',
  'GeneticCounseling',
  'MentalHealthCounseling',
  'CounselingPsychology',
  'ClinicalPsychology',
  'ForensicPsychology',
  'IndustrialOrganizationalPsychology',
  'Neuropsychology',
  'EarlyChildhoodEducation',
  'AdultEducation',
  'EducationalLeadership',
  'SchoolCounseling',
  'AdministrativeSupport',
  'ExecutiveAssistance',
  'OfficeManagement',
  'ProjectManagement',
  'Procurement',
  'RiskManagement',
  'Compliance',
  'Paralegal',
  'PublicPolicy',
  'ElectricalTechnician',
  'Plumbing',
  'Carpentry',
  'HVAC',
  'Welding',
  'AutomotiveTechnology',
  'IndustrialMaintenance',
  'InventoryManagement',
  'Warehousing',
  'FleetManagement'
];

export function useJobFields() {
  // Default to empty array in the useMemo to ensure we never have undefined
  const jobFields = useMemo(() => {
    // Early return with empty array if JOB_FIELD_ENUM is not valid
    if (!Array.isArray(JOB_FIELD_ENUM) || JOB_FIELD_ENUM.length === 0) {
      return [];
    }
    
    // Use ALL job fields from the comprehensive enum
    const allFields = JOB_FIELD_ENUM;
    
    // Safely map through the enum
    try {
      return allFields.map((field, index) => {
        // Convert from camelCase to display format
        const label = field
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .trim();
        
        return {
          value: index.toString(), // Enum index as string
          label
        };
      });
    } catch (error) {
      console.error("Error mapping job fields:", error);
      return [];
    }
  }, []);

  // Double ensure we never return undefined
  return { jobFields: Array.isArray(jobFields) ? jobFields : [] };
}
