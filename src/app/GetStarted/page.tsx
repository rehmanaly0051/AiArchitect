"use client";

import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useRef,
  useEffect,
} from "react";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ReactMarkdown from "react-markdown";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import jsPDF from "jspdf";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { furnitureTypes } from "@/constant/index";

interface Result {
  description: string;
  image_name: string;
  image_url: string;
  prompt?: string;
}

interface FormDataType {
  plot_length: string;
  plot_width: string;
  no_of_floors: string;
  no_of_bedrooms: string;
}

interface ExteriorDesign {
  variation: number;
  variation_id: string;
  num_floors: number;
  color_scheme: string;
  image_base64: string;
}

interface ThreeDViewerProps {
  modelUrl: string | null;
}

const ThreeDViewer: React.FC<ThreeDViewerProps> = ({ modelUrl }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!modelUrl || !mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 600 / 400, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(600, 400);
    const mountNode = mountRef.current;
    mountNode.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf: any) => {
        const model = gltf.scene;
        scene.add(model);

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        model.position.sub(center);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 5 / maxDim;
        model.scale.set(scale, scale, scale);

        camera.position.set(0, 0, 5);
        camera.lookAt(0, 0, 0);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 2;
        controls.maxDistance = 10;

        const animate = () => {
          requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        };
        animate();
      },
      undefined,
      (error: unknown) => {
        console.error("GLTFLoader Error:", error);
        alert("Failed to load 3D model. Ensure the model URL is valid.");
      }
    );

    const handleResize = () => {
      if (mountRef.current) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (mountNode && renderer.domElement) {
        mountNode.removeChild(renderer.domElement);
      }
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [modelUrl]);

  return (
    <div
      ref={mountRef}
      className="w-full h-[400px] rounded-lg bg-gradient-to-br from-white to-gray-100"
    />
  );
};

const GetStarted: React.FC = () => {
  const [formData, setFormData] = useState<FormDataType>({
    plot_length: "",
    plot_width: "",
    no_of_floors: "",
    no_of_bedrooms: "",
  });
  const [result, setResult] = useState<Result | null>(null);
  const [shownImages, setShownImages] = useState<string[]>([]);
  const [prompt, setPrompt] = useState<string>("");
  const [chatbotResponse, setChatbotResponse] = useState<string>("");
  const [interiorImages, setInteriorImages] = useState<string[]>([]);
  const [interiorStatus, setInteriorStatus] = useState<string>("");
  const [exteriorDesigns, setExteriorDesigns] = useState<ExteriorDesign[]>([]);
  const [exteriorStatus, setExteriorStatus] = useState<string>("");
  const [style, setStyle] = useState<string>("modern");
  const [generatedStyle, setGeneratedStyle] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [colorScheme, setColorScheme] = useState<string>("dark grey and black");
  const [numVariations, setNumVariations] = useState<number>(3);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [loadingPrompt, setLoadingPrompt] = useState<boolean>(false);
  const [loadingExterior, setLoadingExterior] = useState<boolean>(false);
  const [loadingInterior, setLoadingInterior] = useState<boolean>(false);
  const [selectedExteriorIndex, setSelectedExteriorIndex] = useState<
    number | null
  >(null);
  const [threeDModelUrl, setThreeDModelUrl] = useState<string | null>(null);
  const [loading3D, setLoading3D] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [variationIds, setVariationIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<{
    plot_length?: string;
    plot_width?: string;
    no_of_floors?: string;
    no_of_bedrooms?: string;
  }>({});
  const [bedroomDimensions, setBedroomDimensions] = useState<
    { length: string; width: string }[]
  >([]);
  const [bedroomErrors, setBedroomErrors] = useState<string[]>([]);
  const [bedroomTouched, setBedroomTouched] = useState(false);

  useEffect(() => {
    if (!bedroomTouched) return;
    const newBedroomErrors: string[] = [];
    if (bedroomDimensions.length === 0) {
      newBedroomErrors.push(
        "Please enter the number of bedrooms and their dimensions."
      );
    } else {
      bedroomDimensions.forEach((room, idx) => {
        const len = Number(room.length);
        const wid = Number(room.width);
        if (!room.length || len <= 0 || len > 30) {
          newBedroomErrors.push(
            `Bedroom ${idx + 1}: Length is required, must be > 0 and ≤ 30.`
          );
        }
        if (!room.width || wid <= 0 || wid > 30) {
          newBedroomErrors.push(
            `Bedroom ${idx + 1}: Width is required, must be > 0 and ≤ 30.`
          );
        }
      });
    }
    setBedroomErrors(newBedroomErrors);
  }, [bedroomDimensions, formData.no_of_bedrooms, bedroomTouched]);

  const validateField = (name: string, value: string): string | undefined => {
    const numValue = parseFloat(value) || 0;
    switch (name) {
      case "plot_length":
        if (numValue <= 0 || numValue > 1000) {
          return "Plot length must be between 1 and 1000 ft.";
        }
        break;
      case "plot_width":
        if (numValue <= 0 || numValue > 1000) {
          return "Plot width must be between 1 and 1000 ft.";
        }
        break;
      case "no_of_floors":
        if (parseInt(value, 10) < 1 || parseInt(value, 10) > 2) {
          return "Number of floors must be between 1 and 2.";
        }
        break;
      case "no_of_bedrooms":
        if (parseInt(value, 10) < 1 || parseInt(value, 10) > 10) {
          return "Number of bedrooms must be between 1 and 10.";
        }
        break;
    }
    return undefined;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Only validate the changed field
    const error = validateField(name, value);
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (error) {
        newErrors[name as keyof FormDataType] = error;
      } else {
        delete newErrors[name as keyof FormDataType];
      }
      return newErrors;
    });

    // Handle dynamic bedroom fields
    if (name === "no_of_bedrooms") {
      const numBedrooms = parseInt(value, 10) || 0;
      setBedroomDimensions((prev) => {
        if (numBedrooms > prev.length) {
          // Add new bedrooms
          return [
            ...prev,
            ...Array(numBedrooms - prev.length).fill({ length: "", width: "" }),
          ];
        } else {
          // Remove extra bedrooms
          return prev.slice(0, numBedrooms);
        }
      });
    }
  };

  const handleBedroomDimensionChange = (
    index: number,
    field: "length" | "width",
    value: string
  ) => {
    setBedroomDimensions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const imageUrl = result?.image_url
    ? `http://127.0.0.1:8000${result.image_url}`
    : "";
  console.log("Image URL:", imageUrl);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBedroomTouched(true);

    const newErrors: Partial<{
      plot_length?: string;
      plot_width?: string;
      no_of_floors?: string;
      no_of_bedrooms?: string;
    }> = {};
    Object.entries(formData).forEach(([name, value]) => {
      const error = validateField(name, value);
      if (error) newErrors[name as keyof FormDataType] = error;
    });
    setErrors(newErrors);

    // Bedroom dimension validation (only on submit)
    const newBedroomErrors: string[] = [];
    if (bedroomDimensions.length === 0) {
      newBedroomErrors.push(
        "Please enter the number of bedrooms and their dimensions."
      );
    } else {
      bedroomDimensions.forEach((room, idx) => {
        const len = Number(room.length);
        const wid = Number(room.width);
        if (!room.length || len <= 0 || len > 30) {
          newBedroomErrors.push(
            `Bedroom ${idx + 1}: Length is required, must be > 0 and ≤ 30.`
          );
        }
        if (!room.width || wid <= 0 || wid > 30) {
          newBedroomErrors.push(
            `Bedroom ${idx + 1}: Width is required, must be > 0 and ≤ 30.`
          );
        }
      });
    }
    setBedroomErrors(newBedroomErrors);

    if (Object.keys(newErrors).length > 0 || newBedroomErrors.length > 0) {
      setChatbotResponse("Please correct the form errors before submitting.");
      return;
    }

    const form_prompt = `I want to build a house with a plot length of ${formData.plot_length} ft, plot width of ${formData.plot_width} ft, number of floors ${formData.no_of_floors}, and ${formData.no_of_bedrooms} bedrooms. Is there anything unrealistic or impossible about this?`;

    setLoadingSubmit(true);
    try {
      const response1 = await fetch(
        "http://127.0.0.1:8000/api/floor/generate/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            plot_length: formData.plot_length,
            plot_width: formData.plot_width,
            no_of_floors: formData.no_of_floors,
            no_of_bedrooms: formData.no_of_bedrooms,
            bedroom_dimensions: bedroomDimensions,
            shown_images: shownImages,
          }),
        }
      );

      if (!response1.ok) {
        const error1 = await response1.json();
        console.error("Floor plan generation error:", error1);
        setChatbotResponse("Failed to generate floor plan.");
        return;
      }

      const data1: Result = await response1.json();
      setResult(data1);
      setShownImages((prev) =>
        prev.includes(data1.image_name) ? prev : [...prev, data1.image_name]
      );

      const response2 = await fetch(
        "http://127.0.0.1:8000/api/chatbot/get-answer/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: form_prompt }),
        }
      );

      if (!response2.ok) {
        const error2 = await response2.json();
        console.error("Chatbot error:", error2);
        setChatbotResponse("Failed to get chatbot response.");
      } else {
        const data2: { answer: string } = await response2.json();
        setChatbotResponse(data2.answer || "No response received.");
      }
    } catch (err) {
      console.error("An error occurred:", err);
      setChatbotResponse("An error occurred while generating the floor plan.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handlePromptSubmit = async () => {
    if (!prompt.trim()) {
      setChatbotResponse("Please enter a valid prompt.");
      return;
    }

    setLoadingPrompt(true);
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/chatbot/get-answer/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: prompt.trim() }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("Chatbot error:", error);
        setChatbotResponse("Failed to get chatbot response.");
      } else {
        const data: { answer: string } = await response.json();
        setChatbotResponse(data.answer || "No response received.");
        setPrompt("");
      }
    } catch (err) {
      console.error("Prompt request failed:", err);
      setChatbotResponse("An error occurred while fetching the response.");
    } finally {
      setLoadingPrompt(false);
    }
  };

  const handleInteriorDesign = async () => {
    if (!result || !result.image_url) {
      setInteriorStatus("Please generate a floor plan first.");
      return;
    }

    setInteriorStatus("Generating interior design...");
    setLoadingInterior(true);
    setInteriorImages([]);
    setIsSidebarOpen(true);

    try {
      const imageResponse = await fetch(
        `http://127.0.0.1:8000/${result.image_url}`
      );
      if (!imageResponse.ok) {
        throw new Error("Failed to fetch floor plan image");
      }
      const imageBlob = await imageResponse.blob();

      const img = document.createElement("img") as HTMLImageElement;
      img.src = URL.createObjectURL(imageBlob);
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement("canvas");
      const maxDimension = 512;
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxDimension) {
          height *= maxDimension / width;
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width *= maxDimension / height;
          height = maxDimension;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
      }

      const base64Data = canvas.toDataURL("image/jpeg", 0.7);
      const base64String = base64Data.split(",")[1];

      const formData = new FormData();
      formData.append("image_base64", base64String);
      formData.append("style", style);
      if (customPrompt.trim()) {
        formData.append("custom_prompt", customPrompt.trim());
      }

      const response = await fetch(
        "https://rehmanalii-interior-design-ai-fix.hf.space/api/process_floorplan",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error("Interior Design API Error:", error);
        setInteriorStatus(
          `Failed to generate interior design. Error: ${error}`
        );
        return;
      }

      const data: {
        success: boolean;
        generated_designs?: { image_base64: string }[];
        message?: string;
      } = await response.json();
      if (data.success && data.generated_designs) {
        const images = data.generated_designs.map(
          (design) => `data:image/png;base64,${design.image_base64}`
        );
        setInteriorImages((prev) => [...prev, ...images]);
        setInteriorStatus(
          `Successfully generated ${data.generated_designs.length} interior designs!`
        );
        setGeneratedStyle(style);
      } else {
        setInteriorStatus(data.message || "No interior designs generated.");
        setInteriorImages([]);
        setGeneratedStyle(null);
      }
    } catch (err) {
      console.error("Interior design request failed:", err);
      setInteriorStatus("An error occurred while generating interior design.");
      setGeneratedStyle(null);
    } finally {
      setLoadingInterior(false);
    }
  };

  const handleExteriorDesign = async () => {
    if (!result || !result.image_url) {
      setExteriorStatus("Please generate a floor plan first.");
      return;
    }

    setExteriorStatus("Generating exterior design...");
    setLoadingExterior(true);
    setExteriorDesigns([]);
    setVariationIds([]);
    setSessionId(null);
    setSelectedExteriorIndex(null);
    setThreeDModelUrl(null);

    try {
      const imageResponse = await fetch(
        `http://127.0.0.1:8000/${result.image_url}`
      );
      if (!imageResponse.ok) {
        throw new Error("Failed to fetch floor plan image");
      }
      const imageBlob = await imageResponse.blob();

      const img = document.createElement("img") as HTMLImageElement;
      img.src = URL.createObjectURL(imageBlob);
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement("canvas");
      const maxDimension = 512;
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxDimension) {
          height *= maxDimension / width;
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width *= maxDimension / height;
          height = maxDimension;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
      }

      const base64Data = canvas.toDataURL("image/jpeg", 0.7);
      const base64String = base64Data.split(",")[1];

      const formData = new FormData();
      formData.append("image_base64", base64String);
      formData.append("color_scheme", colorScheme);
      formData.append("num_variations", numVariations.toString());

      const response = await fetch(
        "https://rehmanalii-interior-design-ai-fix.hf.space/api/process_exterior",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error("Exterior Design API Error:", error);
        setExteriorStatus(
          `Failed to generate exterior design. Error: ${error}`
        );
        return;
      }

      const data: {
        success: boolean;
        generated_designs?: ExteriorDesign[];
        message?: string;
        session_id?: string;
      } = await response.json();
      if (data.success && data.generated_designs) {
        setExteriorDesigns(data.generated_designs);
        setVariationIds(data.generated_designs.map((d) => d.variation_id));
        setSessionId(data.session_id || null);
        setExteriorStatus(
          `Successfully generated ${data.generated_designs.length} exterior designs!`
        );
      } else {
        setExteriorStatus(data.message || "No exterior designs generated.");
        setExteriorDesigns([]);
        setVariationIds([]);
      }
    } catch (err) {
      console.error("Exterior design request failed:", err);
      setExteriorStatus("An error occurred while generating exterior design.");
      setVariationIds([]);
    } finally {
      setLoadingExterior(false);
    }
  };

  const handleGenerate3D = async () => {
    if (selectedExteriorIndex === null) {
      alert("Please select an exterior design first.");
      return;
    }

    if (!sessionId || !variationIds[selectedExteriorIndex]) {
      alert(
        "No session or valid variation available. Please generate an exterior design first."
      );
      return;
    }

    setLoading3D(true);
    setThreeDModelUrl(null);
    try {
      const variationId = variationIds[selectedExteriorIndex];
      const selectedDesign = exteriorDesigns[selectedExteriorIndex];
      const response = await fetch(
        "https://rehmanalii-interior-design-ai-fix.hf.space/api/process_3d",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            session_id: sessionId,
            variation_id: variationId,
            image_base64: selectedDesign.image_base64 || "",
          }).toString(),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.detail || `HTTP error! Status: ${response.status}`
        );
      }

      const data = await response.json();
      if (data.success && (data.model_url || data.obj_url)) {
        setThreeDModelUrl(data.model_url || data.obj_url);
        setExteriorStatus("3D model generated successfully!");
      } else {
        throw new Error("No valid 3D model URL returned from API.");
      }
    } catch (error) {
      console.error("Error generating 3D model:", error);
      alert(
        error instanceof Error
          ? `Failed to generate 3D model: ${error.message}`
          : "Failed to generate 3D model: Unknown error"
      );
    } finally {
      setLoading3D(false);
    }
  };

  const handleDownloadPDF = () => {
    if (
      !result ||
      exteriorDesigns.length === 0 ||
      interiorImages.length === 0
    ) {
      alert(
        "Please generate floor plan, exterior, and interior designs first."
      );
      return;
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    let yPosition = 20;

    doc.setFontSize(18);
    doc.text("House Design Report", 105, yPosition, { align: "center" });
    yPosition += 15;

    const imagesToLoad = [
      { src: imageUrl, type: "Floor Plan" },
      ...exteriorDesigns.map((design, index) => ({
        src: `data:image/png;base64,${design.image_base64}`,
        type: `Exterior Design ${index + 1}`,
      })),
      ...interiorImages.map((src, index) => ({
        src,
        type: `Interior Design ${index + 1}`,
      })),
    ];

    const imagePromises = imagesToLoad.map((img) => {
      return new Promise<{ image: HTMLImageElement; type: string }>(
        (resolve, reject) => {
          const image = new window.Image();
          image.src = img.src;
          image.onload = () => resolve({ image, type: img.type });
          image.onerror = () =>
            reject(new Error(`Failed to load image: ${img.src}`));
        }
      );
    });

    Promise.all(imagePromises)
      .then((loadedImages) => {
        loadedImages.forEach(({ image, type }) => {
          const imgWidth = 180;
          const imgHeight = (image.height * imgWidth) / image.width;

          if (yPosition + imgHeight > 277) {
            doc.addPage();
            yPosition = 20;
          }

          doc.setFontSize(14);
          doc.text(type, 20, yPosition);
          yPosition += 10;

          doc.addImage(
            image.src,
            image.src.startsWith("data:image/png") ? "PNG" : "JPEG",
            20,
            yPosition,
            imgWidth,
            imgHeight
          );
          yPosition += imgHeight + 10;
        });

        doc.save("house_design_report.pdf");
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        alert("Failed to generate PDF: Unable to load images.");
      });
  };

  const handleDownloadFloorPlanPDF = () => {
    if (!result) {
      alert("Please generate a floor plan first!");
      return;
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    let yPosition = 20;

    doc.setFontSize(18);
    doc.text("Floor Plan Report", 105, yPosition, { align: "center" });
    yPosition += 15;

    const imagePromise = new Promise<{ image: HTMLImageElement; type: string }>(
      (resolve, reject) => {
        const image = new window.Image();
        image.src = imageUrl;
        image.onload = () => resolve({ image, type: "Floor Plan" });
        image.onerror = () =>
          reject(new Error(`Failed to load image: ${imageUrl}`));
      }
    );

    imagePromise
      .then(({ image }) => {
        const imgWidth = 180;
        const imgHeight = (image.height * imgWidth) / image.width;

        if (yPosition + imgHeight > 277) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(14);
        doc.text("Floor Plan", 20, yPosition);
        yPosition += 10;

        doc.addImage(
          image.src,
          image.src.startsWith("data:image/png") ? "PNG" : "JPEG",
          20,
          yPosition,
          imgWidth,
          imgHeight
        );
        yPosition += imgHeight + 10;

        doc.save("floor_plan_report.pdf");
      })
      .catch((error) => {
        console.error("Error generating floor plan PDF:", error);
        alert("Failed to generate floor plan PDF: Unable to load image.");
      });
  };

  const handleDownloadExteriorPDF = () => {
    if (exteriorDesigns.length === 0) {
      alert("Please generate exterior designs first!");
      return;
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    let yPosition = 20;

    doc.setFontSize(18);
    doc.text("Exterior Designs Report", 105, yPosition, { align: "center" });
    yPosition += 15;

    const imagePromises = exteriorDesigns.map((design, index) => {
      return new Promise<{ image: HTMLImageElement; type: string }>(
        (resolve, reject) => {
          const image = new window.Image();
          image.src = `data:image/png;base64,${design.image_base64}`;
          image.onload = () =>
            resolve({ image, type: `Exterior Design ${index + 1}` });
          image.onerror = () =>
            reject(new Error(`Failed to load image: ${image.src}`));
        }
      );
    });

    Promise.all(imagePromises)
      .then((loadedImages) => {
        loadedImages.forEach(({ image, type }) => {
          const imgWidth = 180;
          const imgHeight = (image.height * imgWidth) / image.width;

          if (yPosition + imgHeight > 277) {
            doc.addPage();
            yPosition = 20;
          }

          doc.setFontSize(14);
          doc.text(type, 20, yPosition);
          yPosition += 12;

          doc.addImage(
            image.src,
            image.src.startsWith("data:image/png") ? "PNG" : "JPEG",
            20,
            yPosition,
            imgWidth,
            imgHeight
          );
          yPosition += imgHeight + 12;
        });

        doc.save("exterior_designs_report.pdf");
      })
      .catch((error) => {
        console.error("Error generating exterior PDF:", error);
        alert("Failed to generate exterior PDF: Unable to load images.");
      });
  };

  const handleDownloadInteriorPDF = () => {
    if (interiorImages.length === 0) {
      alert("Please generate interior designs first!");
      return;
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    let yPosition = 20;

    doc.setFontSize(18);
    doc.text("Interior Designs Report", 105, yPosition, { align: "center" });
    yPosition += 15;

    const imagePromises = interiorImages.map((src, index) => {
      return new Promise<{ image: HTMLImageElement; type: string }>(
        (resolve, reject) => {
          const image = new window.Image();
          image.src = src;
          image.onload = () =>
            resolve({ image, type: `Interior Design ${index + 1}` });
          image.onerror = () =>
            reject(new Error(`Failed to load image: ${src}`));
        }
      );
    });

    Promise.all(imagePromises)
      .then((loadedImages) => {
        loadedImages.forEach(({ image, type }) => {
          const imgWidth = 180;
          const imgHeight = (image.height * imgWidth) / image.width;

          if (yPosition + imgHeight > 277) {
            doc.addPage();
            yPosition = 20;
          }

          doc.setFontSize(14);
          doc.text(type, 20, yPosition);
          yPosition += 12;

          doc.addImage(
            image.src,
            image.src.startsWith("data:image/png") ? "PNG" : "JPEG",
            20,
            yPosition,
            imgWidth,
            imgHeight
          );
          yPosition += imgHeight + 12;
        });

        doc.save("interior_designs_report.pdf");
      })
      .catch((error) => {
        console.error("Error generating interior PDF:", error);
        alert("Failed to generate interior PDF: Unable to load images.");
      });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 text-gray-800">
      <div className="sm:p-5">
        <Navbar />
        <div className="bg-white h-96 flex items-center justify-center flex-col bg-[url('/getstarte.jpg')] bg-cover bg-center bg-no-repeat">
          <h1 className="text-white text-5xl font-bold">Get Started</h1>
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="text-white hover:text-white">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white font-bold">
                Get Started
              </BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <form onSubmit={onSubmit} className="space-y-12">
          <Card className="bg-white/80 backdrop-blur-md border-none shadow-lg shadow-white/20">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-black">
                House Specifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="plot_length" className="text-gray-600">
                    Plot Length (ft)
                  </Label>
                  <Input
                    id="plot_length"
                    name="plot_length"
                    type="number"
                    value={formData.plot_length}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 50"
                    className="bg-gray-100 text-gray-800 border-gray-300 focus:border-black focus:ring-black"
                  />
                  {errors.plot_length && (
                    <p className="text-red-500 text-sm">{errors.plot_length}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plot_width" className="text-gray-600">
                    Plot Width (ft)
                  </Label>
                  <Input
                    id="plot_width"
                    name="plot_width"
                    type="number"
                    value={formData.plot_width}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 40"
                    className="bg-gray-100 text-gray-800 border-gray-300 focus:border-black focus:ring-black"
                  />
                  {errors.plot_width && (
                    <p className="text-red-500 text-sm">{errors.plot_width}</p>
                  )}
                </div>
                {/* Square Foot Field (auto-calculated) */}
                <div className="space-y-2">
                  <Label htmlFor="sqrfoot" className="text-gray-600">
                    Square Foot (ft²)
                  </Label>
                  <Input
                    id="sqrfoot"
                    name="sqrfoot"
                    type="number"
                    value={
                      formData.plot_length && formData.plot_width
                        ? Number(formData.plot_length) *
                          Number(formData.plot_width)
                        : ""
                    }
                    readOnly
                    disabled
                    placeholder="Auto-calculated"
                    className="bg-gray-100 text-gray-800 border-gray-300 focus:border-black focus:ring-black cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="no_of_floors" className="text-gray-600">
                    Number of Floors
                  </Label>
                  <Input
                    id="no_of_floors"
                    name="no_of_floors"
                    type="number"
                    value={formData.no_of_floors}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 2"
                    className="bg-gray-100 text-gray-800 border-gray-300 focus:border-black focus:ring-black"
                  />
                  {errors.no_of_floors && (
                    <p className="text-red-500 text-sm">
                      {errors.no_of_floors}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="no_of_bedrooms" className="text-gray-600">
                    Number of Bedrooms
                  </Label>
                  <Input
                    id="no_of_bedrooms"
                    name="no_of_bedrooms"
                    type="number"
                    value={formData.no_of_bedrooms}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 3"
                    className="bg-gray-100 text-gray-800 border-gray-300 focus:border-black focus:ring-black"
                  />
                  {errors.no_of_bedrooms && (
                    <p className="text-red-500 text-sm">
                      {errors.no_of_bedrooms}
                    </p>
                  )}
                </div>
                {/* Dynamic Bedroom Dimensions Fields */}
                {bedroomDimensions.length > 0 && (
                  <div className="space-y-4">
                    <Label className="text-gray-700 font-semibold">
                      Bedroom Dimensions
                    </Label>
                    {bedroomDimensions.map((room, idx) => (
                      <div key={idx} className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`bedroom-length-${idx}`}>
                            Bedroom {idx + 1} Length (ft)
                          </Label>
                          <Input
                            id={`bedroom-length-${idx}`}
                            type="number"
                            value={room.length}
                            onChange={(e) =>
                              handleBedroomDimensionChange(
                                idx,
                                "length",
                                e.target.value
                              )
                            }
                            placeholder="Length"
                            className="bg-gray-100 text-gray-800 border-gray-300 focus:border-black focus:ring-black"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`bedroom-width-${idx}`}>
                            Bedroom {idx + 1} Width (ft)
                          </Label>
                          <Input
                            id={`bedroom-width-${idx}`}
                            type="number"
                            value={room.width}
                            onChange={(e) =>
                              handleBedroomDimensionChange(
                                idx,
                                "width",
                                e.target.value
                              )
                            }
                            placeholder="Width"
                            className="bg-gray-100 text-gray-800 border-gray-300 focus:border-black focus:ring-black"
                          />
                        </div>
                      </div>
                    ))}
                    {bedroomTouched && bedroomErrors.length > 0 && (
                      <ul className="text-red-500 text-sm list-disc pl-5">
                        {bedroomErrors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
              <Button
                className="w-full mt-6 bg-black hover:bg-gray-800 text-white font-semibold transition-all duration-300 transform hover:scale-105"
                type="submit"
                disabled={loadingSubmit || Object.keys(errors).length > 0}
              >
                {loadingSubmit ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Generate Floor Plan"
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-white/80 backdrop-blur-md border-none shadow-lg shadow-black/20">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-black">
                  Floor Plan Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      <strong>Description:</strong> {result.description}
                    </p>
                    {imageUrl ? (
                      <div className="relative group">
                        <Image
                          src={imageUrl}
                          alt="Generated Floor Plan"
                          width={800}
                          height={600}
                          className="w-full rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                          unoptimized
                          onError={(e) => console.log("Image load error:", e)}
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                      </div>
                    ) : (
                      <p className="text-red-500 text-center">
                        Image URL is invalid or missing.
                      </p>
                    )}
                    <Button
                      variant="outline"
                      className="w-full mt-4 border-black text-black hover:bg-black hover:text-white transition-all duration-300"
                      onClick={handleDownloadFloorPlanPDF}
                    >
                      Download Floor Plan PDF
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">
                    Generate a floor plan to preview it here.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-md border-none shadow-lg shadow-black/20">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-black">
                  AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    placeholder="Ask about your house design..."
                    value={prompt}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setPrompt(e.target.value)
                    }
                    className="bg-gray-100 text-gray-800 border-gray-300 focus:border-black focus:ring-black"
                  />
                  <Button
                    className="w-full bg-black hover:bg-gray-800 text-white font-semibold transition-all duration-300 transform hover:scale-105"
                    onClick={handlePromptSubmit}
                    disabled={loadingPrompt}
                  >
                    {loadingPrompt ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Ask AI"
                    )}
                  </Button>
                  {chatbotResponse && (
                    <div className="prose max-w-none text-gray-700 bg-gray-100/50 p-4 rounded-lg">
                      <ReactMarkdown>{chatbotResponse}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/80 backdrop-blur-md border-none shadow-lg shadow-black/20">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-black">
                Exterior Design
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="colorScheme" className="text-gray-600">
                      Color Scheme
                    </Label>
                    <Select value={colorScheme} onValueChange={setColorScheme}>
                      <SelectTrigger
                        id="colorScheme"
                        className="bg-gray-100 text-gray-800 border-gray-300 focus:border-black focus:ring-black"
                      >
                        <SelectValue placeholder="Select color scheme" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-100 text-gray-800 border-gray-300">
                        <SelectItem value="dark grey and black">
                          Dark Grey and Black
                        </SelectItem>
                        <SelectItem value="brick red and brown">
                          Brick Red and Brown
                        </SelectItem>
                        <SelectItem value="navy blue and grey">
                          Navy Blue and Grey
                        </SelectItem>
                        <SelectItem value="charcoal grey and brown">
                          Charcoal Grey and Brown
                        </SelectItem>
                        <SelectItem value="terracotta and brown">
                          Terracotta and Brown
                        </SelectItem>
                        <SelectItem value="slate grey and black">
                          Slate Grey and Black
                        </SelectItem>
                        <SelectItem value="white and light grey">
                          White and Light Grey
                        </SelectItem>
                        <SelectItem value="cream and beige">
                          Cream and Beige
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numVariations" className="text-gray-600">
                      Number of Variations (1-5)
                    </Label>
                    <Slider
                      id="numVariations"
                      min={1}
                      max={5}
                      step={1}
                      value={[numVariations]}
                      onValueChange={(value) => setNumVariations(value[0])}
                      className="pt-2"
                    />
                    <p className="text-sm text-gray-500 text-center">
                      {numVariations}
                    </p>
                  </div>
                </div>
                <Button
                  className="w-full bg-black hover:bg-gray-800 text-white font-semibold transition-all duration-300 transform hover:scale-105"
                  onClick={handleExteriorDesign}
                  disabled={loadingExterior}
                >
                  {loadingExterior ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    "Generate Exterior Design"
                  )}
                </Button>
                {exteriorStatus && (
                  <p className="text-sm text-gray-500 text-center">
                    {exteriorStatus}
                  </p>
                )}
              </div>
              {exteriorDesigns.length > 0 && (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {exteriorDesigns.map((design, idx) => (
                    <div key={idx} className="relative group">
                      <input
                        type="radio"
                        name="exteriorImage"
                        id={`exterior-${idx}`}
                        value={idx}
                        checked={selectedExteriorIndex === idx}
                        onChange={() => setSelectedExteriorIndex(idx)}
                        className="absolute top-2 left-2 z-10"
                      />
                      <label htmlFor={`exterior-${idx}`}>
                        <Image
                          src={`data:image/png;base64,${design.image_base64}`}
                          alt={`Exterior design ${idx + 1}`}
                          width={600}
                          height={400}
                          className={`rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105 ${
                            selectedExteriorIndex === idx
                              ? "border-4 border-black"
                              : ""
                          }`}
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
              {exteriorDesigns.length > 0 && (
                <div className="mt-4 space-y-4">
                  <Button
                    className="w-full bg-black hover:bg-gray-800 text-white font-semibold transition-all duration-300 transform hover:scale-105"
                    onClick={handleGenerate3D}
                    disabled={loading3D || selectedExteriorIndex === null}
                  >
                    {loading3D ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Generating 3D Model...
                      </span>
                    ) : (
                      "Generate 3D Model"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-black text-black hover:bg-black hover:text-white transition-all duration-300"
                    onClick={handleDownloadExteriorPDF}
                  >
                    Download Exterior Designs PDF
                  </Button>
                </div>
              )}
              {threeDModelUrl && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-black mb-4">
                    3D Model Viewer
                  </h3>
                  <ThreeDViewer modelUrl={threeDModelUrl} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-md border-none shadow-lg shadow-black/20">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-black">
                Interior Design
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="style" className="text-gray-600">
                      Style
                    </Label>
                    <Select value={style} onValueChange={setStyle}>
                      <SelectTrigger
                        id="style"
                        className="bg-gray-100 text-gray-800 border-gray-300 focus:border-black focus:ring-black"
                      >
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-100 text-gray-800 border-gray-300">
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="minimalist">Minimalist</SelectItem>
                        <SelectItem value="luxury">Luxury</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="custom_prompt" className="text-gray-600">
                      Custom Prompt (Optional)
                    </Label>
                    <Input
                      id="custom_prompt"
                      value={customPrompt}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setCustomPrompt(e.target.value)
                      }
                      placeholder="e.g., Cozy and warm ambiance"
                      className="bg-gray-100 text-gray-800 border-gray-300 focus:border-black focus:ring-black"
                    />
                  </div>
                </div>
                <Button
                  className="w-full bg-black hover:bg-gray-800 text-white font-semibold transition-all duration-300 transform hover:scale-105"
                  onClick={handleInteriorDesign}
                  disabled={loadingInterior}
                >
                  {loadingInterior ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    "Generate Interior Design"
                  )}
                </Button>
                {interiorStatus && (
                  <p className="text-sm text-gray-500 text-center">
                    {interiorStatus}
                  </p>
                )}
              </div>
              <div className="flex flex-col lg:flex-row gap-8 mt-6">
                <div className="flex-1">
                  {interiorImages.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                      {interiorImages.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <Image
                            src={img}
                            alt={`Interior design ${idx + 1}`}
                            width={600}
                            height={400}
                            className="rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                        </div>
                      ))}
                    </div>
                  )}
                  {interiorImages.length > 0 && (
                    <Button
                      variant="outline"
                      className="w-full mt-6 border-black text-black hover:bg-black hover:text-white transition-all duration-300"
                      onClick={handleDownloadInteriorPDF}
                    >
                      Download Interior Designs PDF
                    </Button>
                  )}
                </div>
                {interiorImages.length > 0 && generatedStyle && (
                  <div
                    className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white/90 backdrop-blur-md shadow-xl shadow-black/30 p-6 transform ${
                      isSidebarOpen ? "translate-x-0" : "translate-x-full"
                    } transition-transform duration-300 lg:static lg:w-80 lg:h-auto lg:mt-0 lg:rounded-lg lg:shadow-none lg:transform-none z-50`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-black">
                        Recommended Furniture
                      </h2>
                    </div>
                    <p className="text-gray-700 mb-4">
                      Style:{" "}
                      {generatedStyle.charAt(0).toUpperCase() +
                        generatedStyle.slice(1)}
                    </p>
                    <ScrollArea className="h-[calc(100vh-10rem)]">
                      <div className="space-y-6">
                        {furnitureTypes
                          .filter(
                            (furniture) => furniture.category === generatedStyle
                          )
                          .map((furniture) => (
                            <div key={furniture.id} className="pb-4">
                              <h3 className="text-lg font-semibold text-gray-800">
                                {furniture.type.charAt(0).toUpperCase() +
                                  furniture.type.slice(1)}
                              </h3>
                              <Image
                                src={`/${furniture.image}`}
                                alt={furniture.type}
                                width={200}
                                height={150}
                                className="rounded-lg my-2 transition-transform duration-300 hover:scale-105"
                                unoptimized
                              />
                              <p>{furniture.name}</p>
                              <a
                                href={furniture.reference_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-black hover:text-gray-600 transition-colors duration-300"
                              >
                                View Product
                              </a>
                              <Separator className="mt-4 bg-gray-300" />
                            </div>
                          ))}
                        {furnitureTypes.filter(
                          (furniture) => furniture.category === generatedStyle
                        ).length === 0 && (
                          <p className="text-gray-500">
                            No furniture found for this style.
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
              {interiorImages.length > 0 && (
                <Button
                  className="fixed bottom-4 right-4 bg-black hover:bg-gray-800 text-white font-semibold rounded-full w-12 h-12 flex items-center justify-center lg:hidden z-50"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  🛋️
                </Button>
              )}
            </CardContent>
          </Card>

          {result &&
            exteriorDesigns.length > 0 &&
            interiorImages.length > 0 && (
              <Card className="bg-white/80 backdrop-blur-md border-none shadow-lg shadow-black/20">
                <CardContent className="pt-6">
                  <Button
                    className="w-full bg-black hover:bg-gray-800 text-white font-semibold transition-all duration-300 transform hover:scale-105"
                    onClick={handleDownloadPDF}
                  >
                    Download Complete Design Report
                  </Button>
                </CardContent>
              </Card>
            )}
        </form>
      </div>

      <Footer />
    </main>
  );
};

export default GetStarted;
