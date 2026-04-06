import {
  Award,
  Building2,
  Clock,
  Factory,
  Fuel,
  MapPin,
  Shield,
  Store,
  Triangle,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { ServiceIconKey, WhyUsIconKey } from "@/content/defaultContent";

export const serviceIcons: Record<ServiceIconKey, LucideIcon> = {
  factory: Factory,
  building2: Building2,
  triangle: Triangle,
  fuel: Fuel,
  store: Store,
  wrench: Wrench,
};

export const whyUsIcons: Record<WhyUsIconKey, LucideIcon> = {
  users: Users,
  award: Award,
  clock: Clock,
  shield: Shield,
  mapPin: MapPin,
};
