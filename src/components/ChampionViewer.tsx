import { Champion, DataStatus } from "@/types";
import {
  RiDatabase2Line,
  RiDownloadCloudLine,
  RiLoader4Line,
  RiRefreshLine,
  RiSearchLine,
} from "@remixicon/react";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { ChampionCard } from "./ChampionCard";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

const ITEMS_PER_PAGE = 24;

export default function ChampionViewer() {
  const [status, setStatus] = useState<DataStatus | null>(null);
  const [champions, setChampions] = useState<Champion[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [loadedFromMemory, setLoadedFromMemory] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    checkStatus();
    // Try to fetch champions immediately in case they are already in memory
    fetchChampions(true);
  }, []);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  async function checkStatus() {
    try {
      const s = await invoke<DataStatus>("get_data_status");
      setStatus(s);
    } catch (e) {
      console.error(e);
    }
  }

  async function updateData() {
    setLoading(true);
    try {
      await invoke("update_data");
      await checkStatus();
      await fetchChampions();
    } catch (e) {
      alert("Update failed: " + e);
    } finally {
      setLoading(false);
    }
  }

  async function loadLocalData() {
    setLoading(true);
    try {
      await invoke("load_local_data");
      await fetchChampions();
    } catch (e) {
      alert("Load failed: " + e);
    } finally {
      setLoading(false);
    }
  }

  async function fetchChampions(silent = false) {
    try {
      const data = await invoke<Champion[]>("get_champions");
      setChampions(data);
      setLoadedFromMemory(true);
    } catch (e) {
      setLoadedFromMemory(false);
      if (!silent) console.error(e);
    }
  }

  // 1. Filter
  const filtered = champions.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  // 2. Paginate
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedChampions = filtered.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll the grid container to top
    document
      .getElementById("champion-grid-top")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header / Control Panel - Fixed */}
      <div className="border-border flex-none border-b p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">
              Champion Database
            </h2>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <span>Version:</span>
              <Badge variant="outline" className="font-mono">
                {status?.current_version || "Not Installed"}
              </Badge>
              {status?.latest_version &&
                status.latest_version !== status.current_version && (
                  <span className="text-xs text-amber-500">
                    (New: {status.latest_version})
                  </span>
                )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {!status?.is_up_to_date ? (
              <Button onClick={updateData} disabled={loading}>
                {loading ? (
                  <RiLoader4Line className="mr-2 size-4 animate-spin" />
                ) : (
                  <RiDownloadCloudLine className="mr-2 size-4" />
                )}
                {loading
                  ? "Downloading..."
                  : status?.current_version
                    ? "Update Data"
                    : "Install Data"}
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={updateData}
                disabled={loading}
                className="text-muted-foreground"
              >
                {loading ? (
                  <RiLoader4Line className="mr-2 size-4 animate-spin" />
                ) : (
                  <RiRefreshLine className="mr-2 size-4" />
                )}
                Sync
              </Button>
            )}

            {!loadedFromMemory && status?.current_version && (
              <Button
                variant="secondary"
                onClick={loadLocalData}
                disabled={loading}
              >
                <RiDatabase2Line className="mr-2 size-4" /> Load
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      {!loadedFromMemory ? (
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="border-border bg-muted/20 flex h-64 w-full max-w-lg flex-col items-center justify-center gap-4 rounded-lg border border-dashed text-center">
            <div className="bg-muted flex size-12 items-center justify-center rounded-full">
              <RiDatabase2Line className="text-muted-foreground size-6" />
            </div>
            <div className="max-w-xs space-y-1">
              <h3 className="font-medium">No Data Loaded</h3>
              <p className="text-muted-foreground text-xs">
                Load the data from your local storage or download the latest
                version to view champion stats.
              </p>
            </div>
            {status?.current_version && (
              <Button onClick={loadLocalData} disabled={loading} size="sm">
                Load Now
              </Button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Controls - Fixed below header */}
          <div className="border-border bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-10 flex-none border-b px-8 py-4 backdrop-blur">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-sm flex-1">
                <RiSearchLine className="text-muted-foreground absolute top-2.5 left-2 size-4" />
                <Input
                  placeholder="Search by name or tag..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Simple result counter */}
              <div className="text-muted-foreground text-right text-xs">
                Showing {startIndex + 1}-
                {Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of{" "}
                {filtered.length}
              </div>
            </div>
          </div>

          {/* Grid Area - Scrollable */}
          <div
            className="flex-1 overflow-y-auto p-8"
            id="champion-scroll-container"
          >
            <div
              id="champion-grid-top"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
            >
              {paginatedChampions.map((champ) => (
                <ChampionCard key={champ.key} champion={champ} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-muted-foreground py-12 text-center text-sm">
                No champions found matching "{search}"
              </div>
            )}
          </div>

          {/* Pagination Controls - Fixed Footer */}
          {totalPages > 1 && (
            <div className="border-border bg-background flex-none border-t p-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {/* Logic for smart page numbers (ellipsis) */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      // Show first, last, current, and adjacent pages
                      return (
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1
                      );
                    })
                    .reduce<(number | string)[]>((acc, page, index, array) => {
                      if (index > 0) {
                        const prevPage = array[index - 1];
                        if (page - prevPage > 1) {
                          acc.push("ellipsis-" + index); // Unique key for mapping
                        }
                      }
                      acc.push(page);
                      return acc;
                    }, [])
                    .map((item) => (
                      <PaginationItem key={item}>
                        {typeof item === "string" ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            isActive={currentPage === item}
                            onClick={() => handlePageChange(item as number)}
                          >
                            {item}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
