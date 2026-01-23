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

  // Filter
  const filtered = champions.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Paginate
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedChampions = filtered.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById("champion-scroll-container")?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {/* Header */}
      <div className="border-border bg-background/95 supports-backdrop-filter:bg-background/60 z-20 flex-none border-b p-4 backdrop-blur-md">
        <div className="flex flex-col gap-4">
          {/* Title & Actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-baseline gap-3">
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                Champions
              </h2>
              {status?.current_version ? (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    v{status.current_version}
                  </Badge>
                  {status.latest_version !== status.current_version && (
                    <Badge
                      variant="outline"
                      className="border-amber-500/20 text-[10px] text-amber-500"
                    >
                      Update: {status.latest_version}
                    </Badge>
                  )}
                </div>
              ) : (
                <Badge variant="destructive" className="text-[10px]">
                  No Data
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!status?.is_up_to_date ? (
                <Button onClick={updateData} disabled={loading} size="sm">
                  {loading ? (
                    <RiLoader4Line className="mr-2 size-3.5 animate-spin" />
                  ) : (
                    <RiDownloadCloudLine className="mr-2 size-3.5" />
                  )}
                  {loading ? "Updating..." : "Update"}
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={updateData}
                  disabled={loading}
                  title="Check for updates"
                >
                  <RiRefreshLine
                    className={`size-4 ${loading ? "animate-spin" : ""}`}
                  />
                </Button>
              )}

              {!loadedFromMemory && status?.current_version && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={loadLocalData}
                  disabled={loading}
                >
                  <RiDatabase2Line className="mr-2 size-3.5" /> Load
                </Button>
              )}
            </div>
          </div>

          {/* Search & Stats */}
          {loadedFromMemory && (
            <div className="flex items-center gap-4">
              <div className="relative max-w-md flex-1">
                <RiSearchLine className="text-muted-foreground absolute top-2.5 left-2.5 size-4" />
                <Input
                  placeholder="Search champions..."
                  className="bg-background/50 pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="text-muted-foreground hidden text-xs sm:block">
                {startIndex + 1}-
                {Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of{" "}
                {filtered.length}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div
        id="champion-scroll-container"
        className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6"
      >
        {!loadedFromMemory ? (
          <div className="flex h-full items-center justify-center">
            <div className="border-border bg-muted/20 flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed p-12 text-center">
              <div className="bg-background flex size-12 items-center justify-center rounded-full shadow-sm ring-1 ring-gray-900/5 ring-inset">
                <RiDatabase2Line className="text-muted-foreground size-6" />
              </div>
              <div className="max-w-xs space-y-1">
                <h3 className="font-semibold">No Data Loaded</h3>
                <p className="text-muted-foreground text-sm">
                  Load local data or download the latest version to view
                  champions.
                </p>
              </div>
              {status?.current_version && (
                <Button onClick={loadLocalData} disabled={loading} size="sm">
                  Load Data
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 pb-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {paginatedChampions.map((champ) => (
                <ChampionCard key={champ.key} champion={champ} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-muted-foreground py-12 text-center text-sm">
                No champions found matching "{search}"
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
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
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (page) =>
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1,
                      )
                      .reduce<(number | string)[]>(
                        (acc, page, index, array) => {
                          if (index > 0) {
                            const prevPage = array[index - 1];
                            if (page - prevPage > 1) {
                              acc.push("ellipsis-" + index);
                            }
                          }
                          acc.push(page);
                          return acc;
                        },
                        [],
                      )
                      .map((item) => (
                        <PaginationItem key={item}>
                          {typeof item === "string" ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              isActive={currentPage === item}
                              onClick={() => handlePageChange(item as number)}
                              className="cursor-pointer"
                            >
                              {item}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          handlePageChange(
                            Math.min(totalPages, currentPage + 1),
                          )
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
