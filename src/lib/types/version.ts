import {
  // Item,
  ParseDate,
  Version,
  // Version as VersionDetailProps,
  Workspace,
} from '@/lib/types/models';

export interface VersionProps {
  workspace: Workspace;
  hasAdminRole?: boolean;
  moduleName?: string;
}

export interface initialVersion extends Version {
  range?: ParseDate[];
}

export interface AddItemReleaseModalProps {
  visible: boolean;
  initialValue?: any;
  onSubmit?: (value: Version, fnc: (loading: boolean) => void) => void;
  onClose?: () => void;
  title?: string;
  query?: Parse.Query;
  moduleName?: string;
}

export interface DeleteItemMergeModalProps {
  visible: boolean;
  detail: Version;
  onSubmit: (value: Version, type: string, fnc: (loading: boolean) => void) => void;
  onClose: () => void;
  query: Parse.Query;
  moduleName: string;
}
